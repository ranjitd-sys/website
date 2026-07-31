import { setup, assign } from "xstate";

export type LessonStep = {
  id: string;
  title: string;
  narrative: string;
  code: string;
  question: string;
  choices: { label: string; correct: boolean }[];
  explanation: string;
};

export const steps: LessonStep[] = [
  {
    id: "succeed",
    title: "Effect.succeed is lazy",
    narrative:
      "Effect.succeed(42) doesn't run anything. It just builds a description of a computation that, when run, produces 42.",
    code: `import { Effect } from "effect";

const program = Effect.succeed(42);

console.log(program);`,
    question: "What does console.log(program) print?",
    choices: [
      { label: "42", correct: false },
      { label: "An Effect object describing the computation", correct: true },
      { label: "undefined", correct: false },
    ],
    explanation:
      "program is a value, not a result. Nothing has run yet — you'll see an Effect object, not 42. Effects only produce a value once you actually run them.",
  },
  {
    id: "runsync",
    title: "Running an Effect",
    narrative:
      "To get the value out, you have to run it — with Effect.runSync (for effects that can't fail or suspend) or Effect.runPromise.",
    code: `import { Effect } from "effect";

const program = Effect.succeed(42);
const result = Effect.runSync(program);

console.log(result);`,
    question: "What does this log now?",
    choices: [
      { label: "42", correct: true },
      { label: "An Effect object", correct: false },
      { label: "A Promise", correct: false },
    ],
    explanation:
      "Effect.runSync actually executes the description and hands you back the plain value: 42.",
  },
  {
    id: "gen",
    title: "Sequencing with Effect.gen",
    narrative:
      "Effect.gen lets you write sequential steps with yield*, like async/await but for Effects — each line runs in order, and errors short-circuit the rest.",
    code: `import { Effect } from "effect";

const program = Effect.gen(function* () {
  const a = yield* Effect.succeed(10);
  const b = yield* Effect.succeed(20);
  console.log("adding", a, "and", b);
  return a + b;
});

const result = Effect.runSync(program);
console.log("result:", result);`,
    question: "In what order do the two console.log lines print?",
    choices: [
      { label: '"result: 30" then "adding 10 and 20"', correct: false },
      { label: '"adding 10 and 20" then "result: 30"', correct: true },
      { label: "Only one of them prints", correct: false },
    ],
    explanation:
      "Effect.gen runs top to bottom just like you'd expect from reading it — 'adding 10 and 20' logs inside the generator, then runSync finishes and returns 30, which is logged last.",
  },
];

export type AssessmentQuestion = {
  id: string;
  prompt: string;
  choices: { label: string; correct: boolean }[];
};

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "q1",
    prompt: "Effect.succeed(42) on its own, without running it, produces:",
    choices: [
      { label: "The number 42", correct: false },
      { label: "A description of a computation — nothing has run yet", correct: true },
      { label: "A runtime error", correct: false },
    ],
  },
  {
    id: "q2",
    prompt: "Which function actually executes an Effect and hands back a plain value?",
    choices: [
      { label: "Effect.succeed", correct: false },
      { label: "Effect.runSync", correct: true },
      { label: "Effect.gen", correct: false },
    ],
  },
  {
    id: "q3",
    prompt: "Inside Effect.gen(function* () { ... }), what does yield* do?",
    choices: [
      { label: "Runs an Effect and unwraps its value, in sequence", correct: true },
      { label: "Schedules the Effect to run in parallel", correct: false },
      { label: "Nothing — it's just for TypeScript", correct: false },
    ],
  },
];

const PASS_THRESHOLD = 2; // out of 3

type LessonContext = {
  stepIndex: number;
  selectedChoice: number | null;
  output: string[];
  error: string | null;
  assessmentIndex: number;
  assessmentChoice: number | null;
  score: number;
};

type LessonEvent =
  | { type: "SELECT_CHOICE"; index: number }
  | { type: "REVEAL" }
  | { type: "RUN"; output: string[]; error: string | null }
  | { type: "NEXT" }
  | { type: "START_ASSESSMENT" }
  | { type: "SELECT_ASSESSMENT_CHOICE"; index: number }
  | { type: "SUBMIT_ANSWER" }
  | { type: "RESTART" };

export const lessonMachine = setup({
  types: {
    context: {} as LessonContext,
    events: {} as LessonEvent,
  },
}).createMachine({
  id: "lesson",
  initial: "narrate",
  context: {
    stepIndex: 0,
    selectedChoice: null,
    output: [],
    error: null,
    assessmentIndex: 0,
    assessmentChoice: null,
    score: 0,
  },
  states: {
    narrate: {
      on: { REVEAL: "predict" },
    },
    predict: {
      on: {
        SELECT_CHOICE: {
          actions: assign({ selectedChoice: ({ event }) => event.index }),
        },
        REVEAL: {
          target: "run",
          guard: ({ context }) => context.selectedChoice !== null,
        },
      },
    },
    run: {
      on: {
        RUN: {
          target: "explain",
          actions: assign({
            output: ({ event }) => event.output,
            error: ({ event }) => event.error,
          }),
        },
      },
    },
    explain: {
      on: {
        NEXT: [
          {
            target: "narrate",
            guard: ({ context }) => context.stepIndex < steps.length - 1,
            actions: assign({
              stepIndex: ({ context }) => context.stepIndex + 1,
              selectedChoice: null,
              output: [],
              error: null,
            }),
          },
          { target: "done" },
        ],
      },
    },
    done: {
      on: {
        START_ASSESSMENT: {
          target: "assessment",
          actions: assign({
            assessmentIndex: 0,
            assessmentChoice: null,
            score: 0,
          }),
        },
      },
    },
    assessment: {
      on: {
        SELECT_ASSESSMENT_CHOICE: {
          actions: assign({ assessmentChoice: ({ event }) => event.index }),
        },
        SUBMIT_ANSWER: [
          {
            target: "assessment",
            guard: ({ context }) =>
              context.assessmentChoice !== null &&
              context.assessmentIndex < assessmentQuestions.length - 1,
            actions: assign({
              score: ({ context }) =>
                assessmentQuestions[context.assessmentIndex].choices[
                  context.assessmentChoice!
                ]?.correct
                  ? context.score + 1
                  : context.score,
              assessmentIndex: ({ context }) => context.assessmentIndex + 1,
              assessmentChoice: null,
            }),
          },
          {
            target: "results",
            guard: ({ context }) => context.assessmentChoice !== null,
            actions: assign({
              score: ({ context }) =>
                assessmentQuestions[context.assessmentIndex].choices[
                  context.assessmentChoice!
                ]?.correct
                  ? context.score + 1
                  : context.score,
            }),
          },
        ],
      },
    },
    results: {
      on: {
        RESTART: {
          target: "narrate",
          actions: assign({
            stepIndex: 0,
            selectedChoice: null,
            output: [],
            error: null,
            assessmentIndex: 0,
            assessmentChoice: null,
            score: 0,
          }),
        },
      },
    },
  },
});

export function passed(score: number): boolean {
  return score >= PASS_THRESHOLD;
}

export const TOTAL_ASSESSMENT_QUESTIONS = assessmentQuestions.length;