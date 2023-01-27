/** A framework for ticking through an interactive, choice driven
 * sequence of content, such as a Choose Your Own adventure story.
 *
 * Stories are Typescript Generators that accept choices and yield renderable
 * JSX elements to present to a user. Embedded in each JSX element is a
 * callback to trigger the next choice driven by user interaction.
 *
 * A web application is expected to create a story, and call executeMomentLoop(...)
 * passing a callback. The callback will be notified of each new JSX element which
 * should be rendered, and when the sequence ends. */
import type {
  PageMakerSequence,
  PageMaker,
  Chooser,
  PageMoment,
  EndingMoment,
  PageSequenceMoment,
} from "./types";

/** This story loop gets PageMakers yielded by a PageMakerSequence. It
 * constructs a JSX.Element page from each PageMaker, passing a choose callback.
 * When the callback is triggered, the choice is used to yield another PageMaker
 * from the sequence. This continues until the PageMakerSequence returns.
 *
 * The choice callback is triggered by e.g. a user clicking on some UI element
 * in the rendered JSX. After each cycle of the loop, setMoment is called to
 * notify either the `page` yielded or the `ending` returned by the sequence.
 */
export async function executeMomentLoop<Choice = unknown, Ending = void>(
  sequence: PageMakerSequence<Choice, Ending>,
  notifyMoment: (moment: PageSequenceMoment<Ending>) => void
): Promise<Ending> {
  let lastChoice: Choice | undefined;
  let ending: Ending | null = null;
  while (ending === null) {
    const choice = await new Promise<Choice>((setNextChoice) => {
      const nextMoment = composeNextMoment(sequence, lastChoice, setNextChoice);
      if ("ending" in nextMoment) {
        ({ ending } = nextMoment);
      }
      notifyMoment(nextMoment);
    });
    lastChoice = choice;
  }
  return ending;
}

/** Uses the last choice made to generate the next page or an ending.
 * Accepts callback for the next choice, to embed in the next page.
 * lastChoice is `undefined` for first step in sequence
 */
export function composeNextMoment<Choice = unknown, Ending = void>(
  sequence: PageMakerSequence<Choice, Ending>,
  lastChoice: Choice | undefined,
  setNextChoice: (nextChoice: Choice) => void
): PageSequenceMoment<Ending> {
  const { done, value } =
    lastChoice === undefined ? sequence.next() : sequence.next(lastChoice);
  if (done) {
    // returned with an Ending
    return composeEndingMoment(value);
  }
  // yielded a PageMaker for the next page
  return composePageMoment(value, setNextChoice);
}

/** PageSequence yielded a factory for a page.
 * Create the page. Compose a PageMoment. */
function composePageMoment<Choice>(
  pageMaker: PageMaker<Choice>,
  setNextChoice: Chooser<Choice>
): PageMoment {
  return { page: pageMaker(setNextChoice) };
}

/** PageSequence completed. Compose an EndingMoment. */
function composeEndingMoment<Ending>(ending: Ending): EndingMoment<Ending> {
  return { ending };
}
