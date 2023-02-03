# Watchword

This demonstration framework is structured around Generator functions which
consume actions and yield JSX.Elements, for intuitively-authored branching
logic to be driven by user interactions in a webpage. It's suitable for
interactive fiction (IF) and other use cases.

The @watchword/core package defines the central metaphor - yielding factory
functions for JSX.Elements (factories that accept an event handler callback).
Calling the event handler from within the JSX.Element provides an argument for
the next() call of the generator, causing the generator to yield the next
JSX.Element factory function. This repeats until the generator is exhausted.

Aligning the API with JSX.Element rather than ReactNode means that the core
logic can drive interfaces in Vue, Angular, Solid, etc. which all employ
functions returning JSX as their core API. All current reference
implementations are in React.

## Specialised APIs

In practice, the branching capability is accessed through [Specialised
APIs](#specialised-apis) which hide the component rendering and event handling
details of the web UI. Here's an example...

```typescript
import { prompt, PageSequence } from "@watchword/fiction-grammar";

export function* createPageSequence(): PageSequence {
  const result = yield* prompt(<>What number will you choose?</>, {
    "3": <>I choose Three</>,
    "4": <>I choose Four</>,
    "5": <>I choose Five</>,
  });
  // result has type "3" | "4" | "5"
  if (result === "4") {
    yield <>Hurrah! You chose {result}</>;
    yield <>You were very lucky this time</>;
    yield <>Lucky, lucky, lucky</>;
  } else {
    yield <>You chose {result} - sorry you missed out</>;
  }
  return <>The End</>;
}
```

## Core API

The core API surfaces the power and complexity of the underlying model, allowing inline definition
of any kind of event-driven JSX component. This example aligns with the fiction example
above, but implements all rendering and eventing explicitly.

```typescript
import { ElementSequence, handle } from "@watchword/core";

export function* story(): ElementSequence {
  const result = yield* handle<"3" | "4" | "5">((handler) => (
    <>
      <p>What number will you choose?</p>
      <button onClick={() => handler("3")}>I choose Three</button>
      <button onClick={() => handler("4")}>I choose Four</button>
      <button onClick={() => handler("5")}>I choose Five</button>
    </>
  ));
  // result has type "3" | "4" | "5"
  if (result === "4") {
    yield (next) => (
      <>
        <p>Hurrah! You chose {result}</p>
        <button onClick={next}>Next</button>
      </>
    );
    yield (next) => (
      <>
        <p>You were very lucky this time</p>
        <button onClick={next}>Next</button>
      </>
    );
  } else {
    yield (next) => (
      <>
        <p>You chose {result} - sorry you missed out</p>
        <button onClick={next}>Next</button>
      </>
    );
  }
  return <p>The End</p>;
}
```

## Example application

In practice a working app (such as `apps/book` bundled in this repo) relies on a
stack of deliberately decoupled dependencies like...

- @watchword/core - API: JSX factory generators, listeners for yielded JSX
- @watchword/core-react - Renderer: renders notified JSX in a React component
- @watchword/fiction-grammar - fiction API: generators yielding CYOA payloads
- @watchword/fiction-ui-react - fiction React components: mapped generators
  turning CYOA payloads into React JSX.Elements that render the page
- apps/book - a reference build using Vite that generates a statically built
  website serving stories written using @watchword/fiction-grammar
