# Running the Optimize State Machine — Three Approaches

**Date:** 2026-09-11 · **Scope:** `seo-agent/`
**Files discussed:** `src/agent/Machine.ts`, `src/agent/Driver.ts`, `src/agent/Reviewer.ts`, `src/cli.ts`

This document compares three ways to execute the XState v5 `optimizeMachine`
and explains why the **Interpreter + Strategy** approach (the one implemented in
`Driver.ts`) fits the DeepRank SEO agent.

---

## 1. Problem statement

`Machine.ts` defines *what* the process looks like — states (`IDLE → RESEARCH →
SCOPE → PLAN → ACT → VALIDATE → REVIEWER → CREATE_PR → FINISHED`), the
`REVISE` loop (≤3 retries), and the events that move between states.

A state machine definition is **pure data**. Something must *drive* it:

1. observe the current state,
2. decide which event to emit next (this is where the real work happens),
3. apply the transition,
4. repeat until a final state,
5. obey the retry cap,
6. propagate typed errors,
7. give the steps access to dependencies (Config, Database, Reviewer, future tools).

Three candidate designs deliver these. The table at the end is the decision
record.

---

## 2. Approach A — XState Actor Model

XState v5's native execution model.

```ts
const actor = createActor(optimizeMachine)
actor.start()
actor.subscribe((snap) => log(snap.value))
actor.send({ type: "START" })
actor.send({ type: "RESEARCHED" })
```

The actor owns the event queue, the execution loop and subscriptions. The caller
sends fire-and-forget events and reacts through callbacks.

| Concern | Effect in this model |
|---|---|
| Loop ownership | XState actor |
| Event emission | `actor.send(...)` (no return value) |
| Reacting | `actor.subscribe(...)` callbacks |
| Errors | Actor `getSnapshot().status` / `error`, not an Effect error channel |
| Retry cap | Lives in machine `actions` or inspector callbacks |
| Dependencies | Accessed from inside subscribe/onTransition closures |

**Pain points against the existing codebase:**

- `send()` is fire-and-forget — the driver cannot *await* the next state except
  by subscribing and correlating events; sequential `Effect.gen` becomes
  callback choreography.
- `subscribe()` is push-based; bridging it into Effect's pull-based `yield*`
  requires manual `Effect.async` fences.
- XState runs its own execution loop, introducing a **second runtime** next to
  Effect's fiber runtime — two competing schedulers in one process.
- Errors surface outside Effect's typed error channel, so `DriverError`/`ReviewerError`
  handling in the CLI breaks.
- The retry policy (`REVISE` ≤ 3) is currently enforced *in the driver*; with a
  raw actor it would move into XState `actions`/guards where Effect services are
  harder to reach.

**Used when:** genuinely event-driven actors that react to outside events
(webhooks, streams, inter-agent messaging) and where the actor is a long-lived
process on its own.

---

## 3. Approach B — Hybrid: XState Actor + Effect Runtime

Keep the XState actor, but wrap it in an Effect `Context.Service` + `Layer`,
using `Effect.acquireRelease` so Effect manages the actor's lifecycle.

```ts
export const ActorLive: Layer.Layer<ActorService> = Layer.effect(
  ActorService,
  Effect.acquireRelease(
    Effect.sync(() => createActor(optimizeMachine).start()),
    (actor) => Effect.sync(() => actor.stop()),
  ),
)

// bridge
const impl = {
  send: (e: OptimizeEvent) => Effect.sync(() => actor.send(e)),
  waitFor: (target: string) =>
    Effect.async<string, never>((resume) => {
      const sub = actor.subscribe((snap) => {
        if (snap.value === target) {
          sub.unsubscribe()
          resume(Effect.succeed(snap.value))
        }
      })
      // cleanup on interruption
    }),
}
```

| Concern | Effect in this model |
|---|---|
| Loop ownership | XState actor |
| Lifecycle | Effect `acquireRelease` |
| Sequential use | `waitFor(state)` bridge via `Effect.async` |
| Errors | Bridged manually; XState failure → Effect result |
| Retry cap | Same as A + bridge |
| Dependencies | Services reachable from the requesting Effect, but the actor's internal actions stay outside |

**What it buys:** XState DevTools/visualizer, an event queue, persistence hooks,
and natural support for multiple communicating actors.

**What it costs:**

- A **bridge layer** on every control path (`send`, `getSnapshot`, subscribe →
  sequential). Every `waitFor` is a manual `Effect.async` with interruption
  handling.
- Two runtimes (XState schedule + Effect fibers) still in play.
- Debugging crosses two stacks (actor snapshot changes vs effect fibers).
- For a **deterministic, sequential pipeline** the bridge buys nothing: we never
  drive two actors concurrently, and the ordering is fixed by the machine.

**Used when:** later, if the agent becomes event-triggered (a webhook starts a
run, or a scheduled autonomous pass), or when we want XState visual debugging on
every run.

---

## 4. Approach C — Interpreter + Strategy (current, chosen)

### Roles

| Artifact | Role |
|---|---|
| `Machine.ts` | **Transition table** — the map. States, events, targets, retry semantics (`REVISE` → `VALIDATE`). Pure data, `createMachine`. |
| `Driver.ts` `step()` | **Strategy** — one Effect program per state that produces the *next event*. Today it's stubs; tomorrow it calls `serp`/`gsc`/`crawl`/`build`/`validate`/`github` tools. |
| `Driver.ts` `walk()` | **Interpreter** — the loop. Reads current state, dispatches to the strategy, applies `transition()`, tracks retries/visited, stops at `FINISHED`/`ABORTED`. |
| Effect (services + Layers) | **Runtime** — typed errors (`DriverError`), dependency injection (`yield* Reviewer`), logging, composition. |
| `cli.ts` | **Composition root** — parses argv, provides the Layers, drives one Effect program. |

Key connection point — `Driver.ts`:

```ts
// walk = interpreter
const event = yield* step(snapshot)             // strategy → event
const [nextSnapshot] = transition(optimizeMachine, snapshot, event)
return yield* walk(nextSnapshot, retries, ...)  // recurse
```

```ts
// step = strategy (REVIEWER is the live example)
case "REVIEWER":
  const reviewer = yield* Reviewer              // dependency injection
  const verdict = yield* reviewer.review(change).pipe(Effect.catchCause(...))
  return verdict === "pass" ? { type: "REVIEW_PASSED" } : { type: "REVIEW_FAILED", reason }
```

### Value set

- **One runtime.** XState is used as a *pure transition function*; Effect remains
  the only execution engine.
- **Sequential and awaitable.** `walk` is plain `Effect.gen` recursion — each
  transition is `yield*`-ed, no callbacks, no bridges.
- **Typed errors end-to-end.** `DriverError` on abort reaches `cli.ts` exactly
  like any other Effect failure.
- **Retry policy stays in the driver** next to the machine's `REVISE` state —
  one place to read and change.
- **Strategy is swappable.** `step()` per state is the only place that changes
  when real tools land (Phase 3+). `walk`'s interpreter never does.
- **Testable.** Snapshot → event mapping is a pure-ish function; Layer provides
  the service.

---

## 5. Comparison

| Dimension | A. Actor only | B. Hybrid (actor + Effect) | C. Interpreter + Strategy |
|---|---|---|---|
| Runtime count | XState only | 2 (XState + Effect) | 1 (Effect only) |
| Sequential `Effect.gen` | ❌ callback choreography | ⚠️ needs `waitFor` bridges | ✅ native `yield*` |
| Typed error channel | ❌ | ⚠️ manual bridge | ✅ `DriverError` direct |
| Dependency injection in steps | ❌ closures only | ⚠️ via bridge | ✅ `yield*` services |
| Retry cap location | XState actions | XState + bridge | Driver, next to machine |
| Concurrency of actors | Built-in | Built-in | n/a (sequential by design) |
| XState DevTools / persistence | ✅ | ✅ | ❌ (not needed) |
| Bridge / boilerplate | none | high | none |
| Stack-traces / debugging | clean | crossed stacks | clean |
| Inter-agent messaging | ✅ built-in | ✅ built-in | ❌ (use Effect fibers instead) |
| Fits CLI-driven one-shot run | ❌ | ⚠️ possible | ✅ |

---

## 6. Why Interpreter + Strategy fits our scenario

The DeepRank agent is a **single, deterministic, sequential pipeline**:

- The run is **one-shot** (`bun run cli.ts optimize --dry-run`), not a long-lived
  event loop like a server.
- Each state **depends on the previous state's output** — research facts feed
  scope, the plan feeds the edit, the edit feeds validation. There is no real
  concurrency to model inside one run.
- The only branchy behavior is the **REVISE retry loop**, and its policy (≤3,
  then ABORT) is *control flow*, which belongs in the interpreter (`walk`), not
  in a messaging layer.
- The whole project mandates **Effect-first** (every service is a Layer, typed
  errors, no try/catch). Approach C keeps XState and Effect from inventing two
  hierarchies — XState contributes the state map, Effect contributes everything
  executable.
- **Future parallelism is about *runs*, not actors.** Optimizing several pages at
  once means forking multiple `walk` programs with Effect fibers — each run keeps
  its own machine snapshot. Spawning XState actors there would add a second
  runtime for what Effect fibers already do.
- We don't need the actor model's unique features today: no inter-actor
  messaging, no persistence across processes, no external event sources, no
  DevTools requirement on the CLI.

**Escalation path** — if the agent ever becomes event-driven (webhook kicks off
a run, autonomous scheduled passes, or multiple agents coordinating), the
machine and its events stay identical; we would then adopt Approach B by
wrapping the actor in an Effect Layer. Nothing in the current `step()`/`walk()`
split would need to be thrown away — only the driving loop changes.

---

## 7. Decision
| | |
|---|---|
| **Chosen** | Approach C — Interpreter + Strategy, implemented in `Driver.ts` |
| **Reason** | Sequential pipeline, Effect-first mandate, one runtime, typed errors, retry policy as control flow |
| **Revisit when** | event-driven triggering / inter-agent messaging / XState persistence become requirements |