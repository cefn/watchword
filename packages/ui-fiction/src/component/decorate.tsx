import { Tell } from "./Tell";
import { Prompt } from "./Prompt";
import { PageSequence } from "../page/types";
import { decorateSequence, ElementSequence } from "@watchword/core";

export const DEFAULT_PAGE_ELEMENT_DEFS = {
  Tell,
  Prompt,
} as const;

export function toElementSequence<Choice extends string>(
  pageSequence: PageSequence<Choice>,
  pageElementDefs: typeof DEFAULT_PAGE_ELEMENT_DEFS = DEFAULT_PAGE_ELEMENT_DEFS
): ElementSequence<Choice> {
  const { Tell, Prompt } = pageElementDefs;

  return decorateSequence(pageSequence, (yielded) => {
    // derive the passage
    let passage: JSX.Element;
    if (!("passage" in yielded)) {
      passage = yielded; // yielded JSX passage directly
    } else {
      ({ passage } = yielded); // yielded from tell or prompt
    }

    if ("choices" in yielded) {
      // yielded from prompt - a passage with choices
      const { choices } = yielded;
      return <E extends Choice>(handle: (event: E) => void) => (
        <Prompt passage={passage} choices={choices} nextChoice={handle} />
      );
    }

    // yielded a passage without choices
    return <E extends Choice>(handle: (event: E) => void) => (
      <Tell passage={passage} nextPage={() => handle(null as unknown as E)} /> // TODO Nasty as
    );
  });
}
