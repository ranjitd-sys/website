import { assign, createMachine } from "xstate"

export type OptimizeEvent =
  | { readonly type: "START" }
  | { readonly type: "RESEARCHED" }
  | { readonly type: "OPPORTUNITY_SELECTED"; readonly opportunityId: number }
  | { readonly type: "PLANNED"; readonly action: string }
  | { readonly type: "EDITED" }
  | { readonly type: "VALIDATION_PASSED" }
  | { readonly type: "VALIDATION_FAILED"; readonly reason: string }
  | { readonly type: "REVISED" }
  | { readonly type: "REVIEW_PASSED" }
  | { readonly type: "REVIEW_FAILED"; readonly reason: string }
  | { readonly type: "PR_CREATED"; readonly prUrl: string }
  | { readonly type: "ABORT"; readonly reason: string }

export type OptimizeContext = {
  readonly retries: number
  readonly maxRetries: number
  readonly opportunityId: number | null
  readonly lastReason: string | null
}

export const optimizeMachine = createMachine({
  id: "optimize",
  types: {} as {
    context: OptimizeContext
    events: OptimizeEvent
  },
  context: { retries: 0, maxRetries: 3, opportunityId: null, lastReason: null },
  initial: "IDLE",
  states: {
    IDLE: {
      on: {
        START: { target: "RESEARCH" },
        ABORT: { target: "FINISHED" },
      },
    },
    RESEARCH: {
      on: {
        RESEARCHED: { target: "SCOPE" },
        ABORT: { target: "FINISHED" },
      },
    },
    SCOPE: {
      on: {
        OPPORTUNITY_SELECTED: {
          target: "PLAN",
          actions: assign({ opportunityId: ({ event }) => event.opportunityId }),
        },
        ABORT: { target: "FINISHED" },
      },
    },
    PLAN: {
      on: {
        PLANNED: { target: "ACT" },
        ABORT: { target: "ABORTED" },
      },
    },
    ACT: {
      on: {
        EDITED: { target: "VALIDATE" },
        ABORT: { target: "ABORTED" },
      },
    },
    VALIDATE: {
      on: {
        VALIDATION_PASSED: { target: "REVIEWER" },
        VALIDATION_FAILED: {
          target: "REVISE",
          actions: assign({ lastReason: ({ event }) => event.reason }),
        },
        ABORT: { target: "ABORTED" },
      },
    },
    REVISE: {
      on: {
        REVISED: { target: "VALIDATE" },
        ABORT: { target: "ABORTED" },
      },
    },
    REVIEWER: {
      on: {
        REVIEW_PASSED: { target: "CREATE_PR" },
        REVIEW_FAILED: {
          target: "REVISE",
          actions: assign({ lastReason: ({ event }) => event.reason }),
        },
        ABORT: { target: "ABORTED" },
      },
    },
    CREATE_PR: {
      on: {
        PR_CREATED: { target: "FINISHED" },
        ABORT: { target: "ABORTED" },
      },
    },
    FINISHED: { type: "final" },
    ABORTED: { type: "final" },
  },
})

export type OptimizeMachine = typeof optimizeMachine