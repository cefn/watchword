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
