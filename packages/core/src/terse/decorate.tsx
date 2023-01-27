import {
  PageMakerSequence,
  decorateSequence,
  TellComponent,
} from "@watchword/core";
import { TerseSequence } from "./types";

/** Core story sequences yield PageMaker factory functions. However a terse
 * sequence directly yields JSX elements. This is syntactic sugar for yielding a
 * PageMaker for JSX with the element content and a 'Next' control. The sugar
 * simplifies authoring passages which have no choices. In the terse syntax,
 * delegating yields are reserved for specific features, such as choice prompts.
 *
 * This sequence decorator normalises a terser sequence by wrapping any yielded
 * JSX.Element in a PageMaker with a 'Next' control. The wrapper can be any
 * component which accepts a `page` element and `nextPage` callback. The component
 * defaults to `Tell` from `@watchword/frontend`.
 */
export function decorateTerseSequence<Choice = unknown, Ending = void>(
  terseSequence: TerseSequence<Choice, Ending>,
  Component: TellComponent
): PageMakerSequence<Choice | null, Ending> {
  return decorateSequence(terseSequence, (value) => {
    if (typeof value === "function") {
      // PageMaker values are passed unmodified
      return value;
    }
    // simple JSX.Element values need embedded choice eventing
    // to be added. Here we transform them to a PageMaker - a
    // factory for a UI that interactively triggers a choose callback
    return (choose) => (
      <Component passage={value} nextPage={() => choose(null)} />
    );
  });
}
