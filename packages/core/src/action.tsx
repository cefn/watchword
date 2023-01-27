import {
  Chooser,
  PageMakerSequence,
  PromptComponent,
  TellAction,
  TellComponent,
} from "./types";

/** Convenience function. Maps `Tell`, `Prompt` components to simple `tell`,
 * `prompt` functions. These will enable a story to generate PageMakers with a
 * simple syntax like `yield * tell(...)` or `yield * prompt(...)`. This
 * decoupling allows story-specific web apps to specialise the rendering of the
 * choice interface. */
export function createStoryActions(components: {
  Tell: TellComponent;
  Prompt: PromptComponent;
}) {
  const { Tell, Prompt } = components;

  const tell: TellAction = function* (
    passage: JSX.Element
  ): PageMakerSequence<null, void> {
    yield (choose) => <Tell passage={passage} nextPage={() => choose(null)} />;
  };

  function* prompt<Choice extends string>(
    passage: JSX.Element,
    choices: {
      [k in Choice]: JSX.Element;
    }
  ): PageMakerSequence<Choice, Choice> {
    const chosen = yield (nextChoice: Chooser<Choice>) => (
      <Prompt {...{ passage, choices, nextChoice }} />
    );
    return chosen;
  }

  return { tell, prompt };
}
