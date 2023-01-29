/** Delegating generator that yields data for rendering a passage with a 'next'
 * interaction. Returns void.*/
export function* tell(passage: JSX.Element) {
  yield {
    passage,
  };
}

/** Delegating generator that yields data for rendering a passage with a
 * 'choice' interaction. Returns the choice made by the user. */
export function* prompt<Choice extends string>(
  passage: JSX.Element,
  choices: Readonly<{
    [k in Choice]: JSX.Element;
  }>
) {
  const choice: Choice = yield {
    passage,
    choices,
  };
  return choice;
}
