import { Chooser, PageMakerSequence } from "@watchword/core";
import { Tell, Prompt } from "./components";

/** One-shot delegating generator.
 * Yields a PageMaker that render a single passage with a next button. */
export function* tell(page: JSX.Element): PageMakerSequence<null, void> {
  yield (choose) => <Tell page={page} nextPage={() => choose(null)} />;
}

export function* prompt<Choice extends string>(
  passage: JSX.Element,
  choices: {
    [k in Choice]: JSX.Element;
  }
): PageMakerSequence<Choice, Choice> {
  const chosen = yield (choose: Chooser<Choice>) => (
    <Prompt {...{ passage, choices, choose }} />
  );
  return chosen;
}
