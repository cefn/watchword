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
 * This sequence decorator normalises a terser sequence by mapping a yielded
 * JSX.Element to some TellComponent.
 *
 * Core story sequences yield PageMaker factory functions. However a terse
 * sequence can directly yield JSX elements, simplifying authoring. Yielding JSX
 * directly is syntactic sugar for yielding a factory for a TellComponent (a
 * simple passage with a 'Next' control). In this terse syntax, delegating
 * yields are reserved for sequences having some kind of choice or other
 * specialised, branching interaction.
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
    // simple JSX.Element values are transformed to a PageMaker for a TellComponent
    return (choose) => (
      <Component passage={value} nextPage={() => choose(null)} />
    );
  });
}
