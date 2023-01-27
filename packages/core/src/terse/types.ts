import { PageMaker } from "@watchword/core";

/** Generator of a rendered Story. */
export type TerseSequence<Choice = unknown, Ending = void> = Generator<
  JSX.Element | PageMaker<Choice>,
  Ending,
  Choice
>;

/** Renderer for a minimal page without choices, having an embedded callback to a nextPage */
export type PassageComponent = (props: {
  page: JSX.Element;
  nextPage: () => void;
}) => JSX.Element;
