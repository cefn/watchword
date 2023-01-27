/** Generator of a rendered Story. */
export type PageMakerSequence<Choice = unknown, Ending = void> = Generator<
  PageMaker<Choice>,
  Ending,
  Choice
>;

/** A chooser callback to be triggered by a JSX.Element UI */
export type Chooser<Choice> = (choice: Choice) => void;

/** A factory for a JSX.Element embedding a chooser callback */
export type PageMaker<Choice> = (choose: Chooser<Choice>) => JSX.Element;

/** Captures a page from a story sequence */
export interface PageMoment {
  page: JSX.Element;
}

/** Captures an ending from a story sequence. */
export interface EndingMoment<Ending> {
  ending: Ending;
}

/** A PageSequence may have either rendered a page or reached an ending */
export type PageSequenceMoment<Ending> = PageMoment | EndingMoment<Ending>;

/** Delegating generator. Yields a single PageMaker that renders a passage with
 * a 'next' interaction. */
export type TellSequenceFunction = (
  passage: JSX.Element
) => PageMakerSequence<null, void>;

/** Delegating generator. Yields a single PageMaker that renders a passage with
 * a 'choice' interaction. */
export type PromptSequenceFunction = <Choice extends string>(
  passage: JSX.Element,
  choices: {
    [k in Choice]: JSX.Element;
  }
) => PageMakerSequence<Choice, Choice>;

/** Component interface suitable for rendering a passage with a 'next'
 * interaction. */
export type TellComponent = (props: {
  passage: JSX.Element;
  nextPage: () => void;
}) => JSX.Element;

/** Component interface suitable for rendering a passage with a 'choice'
 * interaction. */
export type PromptComponent = <Choice extends string>(props: {
  passage: JSX.Element;
  choices: {
    [k in Choice]: JSX.Element;
  };
  nextChoice: (choice: Choice) => void;
}) => JSX.Element;

export type GYielded<G extends Generator> = G extends Generator<
  infer Yielded,
  any,
  any
>
  ? Yielded
  : never;

export type TerseSequence<Ending = void> = Generator<
  | JSX.Element
  | GYielded<
      ReturnType<TellSequenceFunction> | ReturnType<PromptSequenceFunction>
    >,
  Ending,
  any
>;
