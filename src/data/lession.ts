export const lessons = {
  "effect-ts": {
    title: "01. Functional Fundamentals: The Effect Type",
    description: "Master the core primitive of the Effect ecosystem. Learn how it explicitly handles asynchronous operations, errors, and dependencies.",
    sections: [
      {
        title: "The Problem with Standard TypeScript",
        text: "In standard TypeScript, managing side effects (like fetching data or reading files) and errors is difficult. Promises don't track the types of errors that can be thrown, meaning you are forced to use `any` or `unknown` in catch blocks. Dependencies are often hardcoded or passed through prop-drilling, making code hard to test and unpredictable."
      },
      {
        title: "What is an Effect?",
        text: "In the Effect ecosystem, an `Effect` is just a description of a program. It is an immutable, lazy value. When you define an Effect, it does not immediately run. It simply models a computation, telling the type system exactly what it needs to execute, what errors it might fail with, and what value it will succeed with.",
        code: `import { Effect } from "effect"\n\n// This does nothing until explicitly executed\nconst program = Effect.succeed("Hello, World!")`
      },
      {
        title: "The Three Type Parameters (A, E, R)",
        text: "The true power of Effect lies in its signature: `Effect<A, E, R>`. Every Effect tracks three things at the type level:\n\n1. Success (A): The type of the value returned if the computation succeeds.\n2. Error (E): The type of the expected error if the computation fails.\n3. Requirements (R): The contextual data or dependencies required to run the computation.",
        code: `// A program that returns a User, might fail with a DbError, and requires a DatabaseService\ntype GetUser = Effect<User, DbError, DatabaseService>`
      },
      {
        title: "Creating Effects",
        text: "You can wrap synchronous code, asynchronous code, and failures into Effects. Instead of throwing errors that crash your application, you return an Effect that explicitly models the failure, forcing the consumer to handle it.",
        code: `import { Effect } from "effect"\n\n// Synchronous success\nconst sync = Effect.succeed(42)\n\n// Expected failure\nconst failing = Effect.fail(new Error("Not found"))\n\n// Wrapping a Promise (Async)\nconst fetchUser = Effect.promise(() => fetch('/api/user').then(r => r.json()))`
      },
      {
        title: "The Pipeline",
        text: "Because Effects are just values, they can be composed together. Effect uses the `pipe` function (or the `.pipe()` method) to chain operations. Data flows from top to bottom, making complex transformations easy to read.",
        code: `import { Effect, pipe } from "effect"\n\nconst program = pipe(\n  Effect.succeed(5),\n  Effect.map(n => n * 2),\n  Effect.map(n => n + 1)\n)\n// Result: 11`
      },
      {
        title: "Transforming Data: map vs flatMap",
        text: "When working within a pipeline, you use `Effect.map` for synchronous transformations (like multiplying a number). If your transformation returns *another* Effect (like making a database call based on an ID), you must use `Effect.flatMap` to prevent nesting Effects inside Effects.",
        code: `import { Effect } from "effect"\n\nconst getUser = (id: number) => Effect.succeed({ id, name: "Alice" })\n\nconst program = Effect.succeed(1).pipe(\n  // flatMap is used because getUser returns an Effect\n  Effect.flatMap(id => getUser(id)),\n  // map is used because we are just returning a standard string\n  Effect.map(user => user.name)\n)`
      },
      {
        title: "Error Recovery (catchAll)",
        text: "Instead of try/catch blocks, Effect handles errors as data in the pipeline. You can use operators like `Effect.catchAll` to intercept a failure and provide a fallback Effect, effectively removing the error from the type signature.",
        code: `import { Effect } from "effect"\n\nconst riskyProgram = Effect.fail("Network Error")\n\nconst recoveredProgram = riskyProgram.pipe(\n  Effect.catchAll(error => Effect.succeed("Fallback Data"))\n)\n// The type is now Effect<string, never, never>`
      },
      {
        title: "Execution: Bringing it to Life",
        text: "Because Effects are lazy descriptions, they must be handed to the Effect runtime to actually execute. You use execution functions depending on whether your program is synchronous or asynchronous.",
        code: `import { Effect } from "effect"\n\nconst syncProgram = Effect.succeed("Hello!")\nconsole.log(Effect.runSync(syncProgram)) // Outputs: "Hello!"\n\nconst asyncProgram = Effect.promise(() => Promise.resolve("Done"))\n// Use runPromise for async operations\nEffect.runPromise(asyncProgram).then(console.log)`
      }
    ],
    quiz: [
      {
        question: "What do the three type parameters in Effect<A, E, R> represent?",
        code: null,
        options: [
          "Async, Error, Result",
          "Success, Error, Requirements",
          "Action, Event, Reaction",
          "Arguments, Execution, Return"
        ],
        correctOptionIndex: 1
      },
      {
        question: "Why are Effects described as \"lazy\"?",
        code: null,
        options: [
          "They are slower than native Promises to save memory.",
          "They run on background threads automatically.",
          "They are just descriptions of programs and don't execute until explicitly run.",
          "They only evaluate primitive types."
        ],
        correctOptionIndex: 2
      },
      {
        question: "How should you model an expected failure in the Effect ecosystem?",
        code: null,
        options: [
          "throw new Error('Failure')",
          "Effect.fail(new Error('Failure'))",
          "Promise.reject('Failure')",
          "return null"
        ],
        correctOptionIndex: 1
      },
      {
        question: "When building a pipeline, when should you use Effect.flatMap instead of Effect.map?",
        code: null,
        options: [
          "When you want to flatten an array of numbers.",
          "When the transformation function returns a standard Promise.",
          "When the transformation function returns another Effect.",
          "When you need to log a value to the console."
        ],
        correctOptionIndex: 2
      },
      {
        question: "What happens to the type signature of an Effect if you successfully handle all errors using Effect.catchAll?",
        code: `const handled = risky.pipe(Effect.catchAll(() => Effect.succeed("Safe")))`,
        options: [
          "The Error type (E) becomes `any`.",
          "The Error type (E) becomes `never`.",
          "The Success type (A) becomes `unknown`.",
          "The pipeline fails to compile."
        ],
        correctOptionIndex: 1
      },
      {
        question: "Look at the type signature. What does this Effect require to execute?",
        code: `type ProcessOrder = Effect<boolean, PaymentError, StripeService>`,
        options: [
          "It requires a boolean.",
          "It requires a PaymentError.",
          "It requires a StripeService.",
          "It does not require anything."
        ],
        correctOptionIndex: 2
      },
      {
        question: "Which function must you use to execute an Effect that wraps a Promise?",
        code: `const fetchTask = Effect.promise(() => fetch('/data'))`,
        options: [
          "Effect.runSync",
          "Effect.execute",
          "Effect.runPromise",
          "Effect.await"
        ],
        correctOptionIndex: 2
      },
      {
        question: "What is the final output of this pipeline when executed?",
        code: `const program = pipe(\n  Effect.succeed(10),\n  Effect.map(x => x / 2),\n  Effect.flatMap(x => Effect.succeed(x + 5))\n)`,
        options: [
          "5",
          "10",
          "15",
          "Effect(10)"
        ],
        correctOptionIndex: 2
      }
    ]
  },
  

};