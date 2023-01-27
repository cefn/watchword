import {
  ActionSequence,
  PromptComponent,
  TellComponent,
  PageMakerSequence,
  PromptSequenceFunction,
  TellSequenceFunction,
} from "./types";
import { decorateSequence } from "./util";

/** Maps `Tell`, `Prompt` components to simple `tell`, `prompt` sequence
 * functions. This allows web apps to specialise rendering for a story.
 *
 * The resulting functions facilitate a simple delegating yield syntax like
 * `yield * tell(...)` or `yield * prompt(...)` to generate PageMakerSequences.
 * */
export function mapComponentsToSequences(components: {
  Tell: TellComponent;
  Prompt: PromptComponent;
}) {
  const { Tell, Prompt } = components;

  const tell: TellSequenceFunction = function* (
    passage: JSX.Element
  ): PageMakerSequence<null, void> {
    yield (choose) => <Tell passage={passage} nextPage={() => choose(null)} />;
  };

  const prompt: PromptSequenceFunction = function* <Choice extends string>(
    passage: JSX.Element,
    choices: {
      [k in Choice]: JSX.Element;
    }
  ): PageMakerSequence<Choice, Choice> {
    const chosen = yield (nextChoice) => (
      <Prompt {...{ passage, choices, nextChoice }} />
    );
    return chosen;
  };

  return { tell, prompt };
}

/**
 * Normalises an ActionSequence to a PageMakerSequence by mapping any raw
 * yielded JSX.Element to a PageMaker instead.
 *
 * A PageMakerSequence normally delegates to generator functions that yield
 * PageMakers (factory functions for JSX elements having options and callbacks).
 * A terse sequence can yield raw JSX elements, a 'syntactic sugar' that
 * simplifies authoring.
 *
 * In detail, yielding raw JSX in an ActionSequence is equivalent to delegating
 * to a sequence that yields a PageMaker for a TellComponent (a simple passage
 * with a 'Next' control and no options or branching).
 */
export function decorateRawJsx<Ending = void>(
  actionSequence: ActionSequence<Ending>,
  Component: TellComponent
): PageMakerSequence<unknown, Ending> {
  return decorateSequence(actionSequence, (value) => {
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
