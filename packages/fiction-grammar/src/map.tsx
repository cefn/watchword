import {
  createMappedGenerator,
  ElementSequence,
  Handler,
} from "@watchword/core";
import {
  PageElementDefs,
  PageSequence,
  PromptAction,
  TellAction,
} from "./types";

/** Given a set of components which conform to the right API, this turns a
 * generator of payloads for Tell or Prompt pages into a generator of rendered
 * JSX Elements with embedded handlers
 */
export function toElementSequence(
  pageSequence: PageSequence,
  pageElementDefs: PageElementDefs
): ElementSequence {
  const { Tell, Prompt } = pageElementDefs;

  function composeTell(action: TellAction) {
    const { passage } = action;
    return (handle: Handler<null>) => (
      <Tell passage={passage} nextPage={() => handle(null)} />
    );
  }

  function composePrompt<Choice extends string>(action: PromptAction<Choice>) {
    const { passage, choices } = action;
    return (handleChoice: Handler<Choice>) => (
      <Prompt passage={passage} choices={choices} handleChoice={handleChoice} />
    );
  }

  return createMappedGenerator(pageSequence, (yielded) => {
    // it's an Action with a passage
    if ("choices" in yielded) {
      // it's a PromptAction
      return composePrompt(yielded);
    }
    // it's a TellAction, (with a passage member containing a JSX)
    // or a JSX.Element, (transform it to a TellAction)
    return composeTell("passage" in yielded ? yielded : { passage: yielded });
  });
}
