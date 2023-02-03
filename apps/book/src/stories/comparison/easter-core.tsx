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
