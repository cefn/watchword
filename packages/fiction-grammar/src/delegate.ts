import { PromptAction, TellAction } from "./types";

/** Yields a payload for a passage with a 'next' interaction. Returns void. */
export function* tell(passage: JSX.Element): Generator<TellAction, void, void> {
  yield {
    passage,
  };
}

/** Yields a payload for a passage with a 'choice' interaction. Returns the
 * choice made by the user. */
export function* prompt<Choice extends string>(
  passage: JSX.Element,
  choices: Readonly<{
    [k in Choice]?: JSX.Element;
  }>
): Generator<PromptAction<Choice>, Choice, Choice> {
  const choice: Choice = yield {
    passage,
    choices,
  };
  return choice;
}
