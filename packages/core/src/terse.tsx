import {
  PageMakerSequence,
  decorateSequence,
  TellComponent,
} from "@watchword/core";

/** Specialises PageMakerSequence to allow direct yielding of JSX elements */
export type TerseSequence<Choice = unknown, Ending = void> = PageMakerSequence<
  Choice,
  Ending
> extends Generator<infer Yielded, infer Returned, infer Nexted>
  ? Generator<Yielded | JSX.Element, Returned, Nexted>
  : never;

/**
 * Normalises a TerseSequence back to a PageMakerSequence by mapping any raw
 * yielded JSX.Element to a TellComponent.
 *
 * A PageMakerSequence normally delegates to functions yielding PageMakers
 * (factory functions for JSX elements with embedded eventing and branching).
 * However, a terse sequence can directly yield JSX elements, a 'syntactic
 * sugar' that simplifies authoring.
 *
 * Yielding JSX is equivalent to delegating to a sequence yielding a
 * TellComponent (a simple passage with a 'Next' control and no options or
 * branching).
 */
export function decorateTerseSequence<Choice = unknown, Ending = void>(
  terseSequence: TerseSequence<Choice, Ending>,
  Component: TellComponent
): PageMakerSequence<Choice | null, Ending> {
  return decorateSequence(terseSequence, (value) => {
    if (typeof value === "function") {
      // passthrough PageMaker values
      return value;
    }
    // wrap a raw JSX.Element in a TellComponent factory
    return (choose) => (
      <Component passage={value} nextPage={() => choose(null)} />
    );
  });
}
