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
