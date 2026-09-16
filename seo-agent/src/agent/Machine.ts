import { assign, createMachine } from "xstate"
import type { Change, DiscoveredKeyword, PlanOutput, ResearchRow, SelectedOpportunity } from "../types/agent.js"

export type OptimizeEvent =
  | { readonly type: "START" }
  | { readonly type: "DISCOVERED"; readonly keywords: ReadonlyArray<DiscoveredKeyword> }
  | { readonly type: "RESEARCHED"; readonly research: ReadonlyArray<ResearchRow> }
  | { readonly type: "OPPORTUNITY_SELECTED"; readonly opportunityId: number; readonly selected: SelectedOpportunity }
  | { readonly type: "PLANNED"; readonly action: string; readonly plan: PlanOutput }
  | { readonly type: "EDITED"; readonly change: Change }
  | { readonly type: "VALIDATION_PASSED" }
  | { readonly type: "VALIDATION_FAILED"; readonly reason: string }
  | { readonly type: "REVISED"; readonly change?: Change }
  | { readonly type: "REVIEW_PASSED" }
  | { readonly type: "REVIEW_FAILED"; readonly reason: string }
  | { readonly type: "PR_CREATED"; readonly prUrl: string }
  | { readonly type: "ABORT"; readonly reason: string }

export type OptimizeContext = {
  readonly retries: number
  readonly maxRetries: number
  readonly opportunityId: number | null
  readonly lastReason: string | null
  readonly keywords: ReadonlyArray<DiscoveredKeyword>
  readonly research: ReadonlyArray<ResearchRow>
  readonly selected: SelectedOpportunity | null
  readonly plan: PlanOutput | null
  readonly change: Change | null
  readonly prUrl: string | null
  readonly visited: ReadonlyArray<string>
}

export const optimizeMachine = createMachine({
  id: "optimize",
  types: {} as {
    context: OptimizeContext
    events: OptimizeEvent
  },
  context: {
    retries: 0,
    maxRetries: 3,
    opportunityId: null,
    lastReason: null,
    keywords: [],
    research: [],
    selected: null,
    plan: null,
    change: null,
    prUrl: null,
    visited: [],
  },
  initial: "IDLE",
  states: {
    IDLE: {
      on: {
        START: { target: "KEYWORD_DISCOVERY" },
        ABORT: { target: "FINISHED", actions: assign({ lastReason: ({ event }) => event.reason }) },
      },
    },
    KEYWORD_DISCOVERY: {
      on: {
        DISCOVERED: {
          target: "RESEARCH",
          actions: assign({ keywords: ({ event }) => event.keywords }),
        },
        ABORT: { target: "FINISHED", actions: assign({ lastReason: ({ event }) => event.reason }) },
      },
    },
    RESEARCH: {
      on: {
        RESEARCHED: {
          target: "SCOPE",
          actions: assign({ research: ({ event }) => event.research }),
        },
        ABORT: { target: "FINISHED", actions: assign({ lastReason: ({ event }) => event.reason }) },
      },
    },
    SCOPE: {
      on: {
        OPPORTUNITY_SELECTED: {
          target: "PLAN",
          actions: assign({
            opportunityId: ({ event }) => event.opportunityId,
            selected: ({ event }) => event.selected,
          }),
        },
        ABORT: { target: "FINISHED", actions: assign({ lastReason: ({ event }) => event.reason }) },
      },
    },
    PLAN: {
      on: {
        PLANNED: {
          target: "ACT",
          actions: assign({ plan: ({ event }) => event.plan }),
        },
        ABORT: { target: "ABORTED", actions: assign({ lastReason: ({ event }) => event.reason }) },
      },
    },
    ACT: {
      on: {
        EDITED: {
          target: "VALIDATE",
          actions: assign({ change: ({ event }) => event.change }),
        },
        ABORT: { target: "ABORTED", actions: assign({ lastReason: ({ event }) => event.reason }) },
      },
    },
    VALIDATE: {
      on: {
        VALIDATION_PASSED: { target: "REVIEWER" },
        VALIDATION_FAILED: {
          target: "REVISE",
          actions: assign({ lastReason: ({ event }) => event.reason }),
        },
        ABORT: { target: "ABORTED", actions: assign({ lastReason: ({ event }) => event.reason }) },
      },
    },
    REVISE: {
      on: {
        REVISED: {
          target: "VALIDATE",
          actions: assign({
            change: ({ context, event }) => event.change ?? context.change,
            retries: ({ context }) => context.retries + 1,
          }),
        },
        ABORT: { target: "ABORTED", actions: assign({ lastReason: ({ event }) => event.reason }) },
      },
    },
    REVIEWER: {
      on: {
        REVIEW_PASSED: { target: "CREATE_PR" },
        REVIEW_FAILED: {
          target: "REVISE",
          actions: assign({ lastReason: ({ event }) => event.reason }),
        },
        ABORT: { target: "ABORTED", actions: assign({ lastReason: ({ event }) => event.reason }) },
      },
    },
    CREATE_PR: {
      on: {
        PR_CREATED: {
          target: "FINISHED",
          actions: assign({ prUrl: ({ event }) => event.prUrl }),
        },
        ABORT: { target: "ABORTED", actions: assign({ lastReason: ({ event }) => event.reason }) },
      },
    },
    FINISHED: { type: "final" },
    ABORTED: { type: "final" },
  },
})

export type OptimizeMachine = typeof optimizeMachine