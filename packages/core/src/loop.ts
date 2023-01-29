import { ElementFactory, ElementSequence, EventHandler } from "./types";

/** Core logic for ticking through an interactive sequence of content, such as
 * a Choose Your Own adventure story.
 *
 * ElementSequences are Typescript Generators that accept event handlers and
 * yield renderable JSX elements to present to a user. Embedded in each JSX
 * element is some user interaction that will trigger the event handler and
 * causing the next element to be loaded and shown.
 *
 * A web application is expected to create a sequence, and call
 * executeSequenceLoop(...) passing a callback. The callback will be notified of
 * each new JSX element which should be rendered, with executeSequenceLoop
 * returning when the sequence ends. */
export async function executeUiLoop<Event = unknown>(
  sequence: ElementSequence<Event>,
  setElement: (element: JSX.Element) => void
): Promise<void> {
  const END = {};
  let lastEvent: Event | undefined = undefined;
  for (;;) {
    try {
      lastEvent = await new Promise<Event>((handleEvent) => {
        const ui = composeNextUi(sequence, lastEvent, handleEvent);
        if ("ending" in ui) {
          setElement(ui.ending);
          throw END; // finalise the awaited promise
        }
        setElement(ui.paging); // expect promise to be resolved
      });
    } catch (e) {
      if (e !== END) {
        throw e;
      }
      break;
    }
  }
}

/** Uses the last choice made to generate the next page or an ending.
 * Accepts callback for the next choice, to embed in the next page.
 * lastEvent is `undefined` for first step in sequence
 */
export function composeNextUi<Event = unknown>(
  sequence: ElementSequence<Event>,
  lastEvent: Event | undefined,
  eventHandler: EventHandler<Event>
) {
  const { done, value } =
    lastEvent === undefined ? sequence.next() : sequence.next(lastEvent);
  if (done) {
    // it's Ending - expect no later event
    return composeUneventedUi(value);
  }
  // it's Paging - expect a later event
  return composeEventedUi(value, eventHandler);
}

/** PageSequence yielded a factory for a event-handling paging element. */
function composeEventedUi<Event>(
  elementFactory: ElementFactory<Event>,
  eventHandler: EventHandler<Event>
) {
  return { paging: elementFactory(eventHandler) };
}

/** PageSequence yielded an ending element. */
function composeUneventedUi(ending: JSX.Element) {
  return { ending };
}
