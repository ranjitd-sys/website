import { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Effect } from "effect";
import {
  lessonMachine,
  steps,
  assessmentQuestions,
  passed,
  TOTAL_ASSESSMENT_QUESTIONS,
} from "./lesstionMachine";

type Props = {
  lessonSlug?: string;
};

export default function EffectPlayground({ lessonSlug = "effect-ts" }: Props) {
  const [state, send] = useMachine(lessonMachine);
  const step = steps[state.context.stepIndex];

  const primaryBtn =
    "mt-3 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed";

  function runCode() {
    const output: string[] = [];
    let error: string | null = null;
    const body = step.code.replace(/^import.*\n\n?/, "");
    const fakeConsole = {
      log: (...args: unknown[]) => {
        output.push(args.map((a) => stringify(a)).join(" "));
      },
    };
    try {
      // eslint-disable-next-line no-new-func
      const run = new Function("Effect", "console", body);
      run(Effect, fakeConsole);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    send({ type: "RUN", output, error });
  }

  // when we land on results with a passing score, persist it so the
  // static footer on the page can pick it up
  useEffect(() => {
    if (state.matches("results") && passed(state.context.score)) {
      localStorage.setItem(`lesson:${lessonSlug}:completed`, "true");
      window.dispatchEvent(new CustomEvent("lesson-completed", { detail: { lessonSlug } }));
    }
  }, [state.value]);

  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4 rounded-sm text-[11px]">
      {!state.matches("assessment") && !state.matches("results") && (
        <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-3">
          Step {state.context.stepIndex + 1} / {steps.length} — {step.title}
        </div>
      )}

      {state.matches("narrate") && (
        <>
          <p className="text-zinc-300 leading-relaxed mb-3">{step.narrative}</p>
          <pre className="bg-black border border-zinc-800 p-3 rounded-sm overflow-x-auto text-zinc-400">
            <code>{step.code}</code>
          </pre>
          <button className={primaryBtn} onClick={() => send({ type: "REVEAL" })}>
            Continue
          </button>
        </>
      )}

      {state.matches("predict") && (
        <>
          <pre className="bg-black border border-zinc-800 p-3 rounded-sm overflow-x-auto text-zinc-400 mb-3">
            <code>{step.code}</code>
          </pre>
          <p className="text-zinc-300 mb-2">{step.question}</p>
          <div className="flex flex-col gap-1.5 mb-2">
            {step.choices.map((choice, i) => (
              <button
                key={i}
                className={`text-left px-3 py-1.5 border rounded-sm transition-colors ${
                  state.context.selectedChoice === i
                    ? "border-emerald-400 bg-emerald-950/40 text-emerald-300"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}
                onClick={() => send({ type: "SELECT_CHOICE", index: i })}
              >
                {choice.label}
              </button>
            ))}
          </div>
          <button
            className={primaryBtn}
            disabled={state.context.selectedChoice === null}
            onClick={() => send({ type: "REVEAL" })}
          >
            Run it and see
          </button>
        </>
      )}

      {state.matches("run") && (
        <>
          <pre className="bg-black border border-zinc-800 p-3 rounded-sm overflow-x-auto text-zinc-400 mb-3">
            <code>{step.code}</code>
          </pre>
          <button className={primaryBtn} onClick={runCode}>
            ▶ Run
          </button>
        </>
      )}

      {state.matches("explain") && (
        <>
          <pre className="bg-black border border-zinc-800 p-3 rounded-sm overflow-x-auto text-zinc-400 mb-3">
            <code>{step.code}</code>
          </pre>
          <div className="bg-black border border-zinc-800 rounded-sm p-3 mb-3 font-mono">
            {state.context.error ? (
              <div className="text-red-400">Error: {state.context.error}</div>
            ) : (
              state.context.output.map((line, i) => (
                <div key={i} className="text-emerald-400">
                  {line}
                </div>
              ))
            )}
          </div>
          <p
            className={
              step.choices[state.context.selectedChoice ?? -1]?.correct
                ? "text-emerald-400 font-semibold uppercase tracking-wider text-[10px]"
                : "text-red-400 font-semibold uppercase tracking-wider text-[10px]"
            }
          >
            {step.choices[state.context.selectedChoice ?? -1]?.correct
              ? "✓ You called it."
              : "✗ Not quite — here's why:"}
          </p>
          <p className="text-zinc-400 leading-relaxed mt-2 mb-3">{step.explanation}</p>
          <button className={primaryBtn} onClick={() => send({ type: "NEXT" })}>
            {state.context.stepIndex < steps.length - 1 ? "Next" : "Continue to assessment"}
          </button>
        </>
      )}

      {state.matches("done") && (
        <>
          <p className="text-zinc-300 mb-1">
            That covers Effect.succeed, running effects, and Effect.gen.
          </p>
          <p className="text-zinc-500 mb-3">
            {TOTAL_ASSESSMENT_QUESTIONS} quick questions to check it stuck — you need{" "}
            {Math.ceil(TOTAL_ASSESSMENT_QUESTIONS * 0.66)}/{TOTAL_ASSESSMENT_QUESTIONS} to pass.
          </p>
          <button className={primaryBtn} onClick={() => send({ type: "START_ASSESSMENT" })}>
            Start assessment
          </button>
        </>
      )}

      {state.matches("assessment") && (
        <>
          <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-3">
            Assessment — Question {state.context.assessmentIndex + 1} /{" "}
            {assessmentQuestions.length}
          </div>
          <p className="text-zinc-300 mb-2">
            {assessmentQuestions[state.context.assessmentIndex].prompt}
          </p>
          <div className="flex flex-col gap-1.5 mb-2">
            {assessmentQuestions[state.context.assessmentIndex].choices.map((choice, i) => (
              <button
                key={i}
                className={`text-left px-3 py-1.5 border rounded-sm transition-colors ${
                  state.context.assessmentChoice === i
                    ? "border-emerald-400 bg-emerald-950/40 text-emerald-300"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}
                onClick={() => send({ type: "SELECT_ASSESSMENT_CHOICE", index: i })}
              >
                {choice.label}
              </button>
            ))}
          </div>
          <button
            className={primaryBtn}
            disabled={state.context.assessmentChoice === null}
            onClick={() => send({ type: "SUBMIT_ANSWER" })}
          >
            {state.context.assessmentIndex < assessmentQuestions.length - 1
              ? "Next question"
              : "Submit assessment"}
          </button>
        </>
      )}

      {state.matches("results") && (
        <>
          <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-3">
            Assessment results
          </div>
          <p className="text-zinc-300 mb-1">
            Score: {state.context.score} / {assessmentQuestions.length}
          </p>
          {passed(state.context.score) ? (
            <p className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px] mb-3">
              ✓ Passed — assignment unlocked below
            </p>
          ) : (
            <p className="text-red-400 font-semibold uppercase tracking-wider text-[10px] mb-3">
              ✗ Not yet — review the lesson and try again
            </p>
          )}
          <button className={primaryBtn} onClick={() => send({ type: "RESTART" })}>
            Restart lesson
          </button>
        </>
      )}
    </div>
  );
}

function stringify(value: unknown): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}