/** Creates a combined state for the whole interview.
 * The InterviewState points to all the individual TaleStates
 * The stores point to partitioned stores from the Store<InterviewState>
 * with each Tale's state reference tracking changes in its partition.
 */
import {
  createStore,
  createStorePartition,
  Immutable,
  Store,
} from "@lauf/store";
import { safeKeys, safeEntries } from "@watchword/core";
import type { PageSequence } from "@watchword/fiction-grammar";
import type {
  Interview,
  InterviewState,
  TaleId,
  TaleStoreCache,
} from "./types";
import { everyRoleTagged } from "./logic";
import { createTaleComparator } from "./priority";

/** Combine states of an interview's Tales into a single watchable
 * InterviewState, keyed by taleId. */
function initInterviewState<I extends Interview<string>>(interview: I) {
  return Object.fromEntries(
    safeKeys(interview).map((taleId) => [taleId, interview[taleId].state])
  ) as Immutable<InterviewState<I>>;
}

/** Map pre-populated with a store per Tale in the interview.
 * Tale stores are simply self-contained partitions of the central
 * InterviewState. This procedure creates a cache of all the
 * partitions by taleId to avoid re-creating them on every access
 */
function cacheTaleStores<I extends Interview<any>>(
  interview: I,
  interviewStore: Store<InterviewState<I>>
) {
  return Object.fromEntries(
    safeKeys(interview).map((taleId) => [
      taleId,
      createStorePartition(interviewStore, taleId),
    ])
  ) as TaleStoreCache<I>;
}

/** Retrieve correctly typed TaleStore from a TaleStoreCache for a given taleId. */
function getTaleStore<I extends Interview<any>, Id extends TaleId<I>>(
  taleStoreCache: TaleStoreCache<I>,
  taleId: Id
) {
  // tale inferred from id
  type InferredTale = I[Id];
  // store is first arg to tale
  type InferredStore = Parameters<InferredTale>[0];
  // typesafe return value
  return taleStoreCache[taleId] as unknown as InferredStore;
}

/** Initialises an interview I, creating an ancestor Store for InterviewState<I>
 * that can be watched by the UI (a composition of Tale states). For each tale,
 * a TaleStore is bound to its part of the interview state. This ensures that
 * Store edits via InterviewState<I> or TaleState<Tale> are bound to each other,
 * and that edits to any TaleState will update the immutable state reference on
 * the Tale itself. */
export function createInterviewModel<I extends Interview<any>>(interview: I) {
  // initialise the interview store
  const interviewStore = createStore(initInterviewState(interview));

  // cache each tale's store partition, (reference need never change)
  const taleStoreCache = cacheTaleStores(interview, interviewStore);

  // wire each tale to track its own store state
  for (const [taleId, taleStore] of safeEntries(taleStoreCache)) {
    taleStore.watch((state) => {
      interview[taleId].state = state;
    });
  }

  return {
    interview,
    interviewStore,
    taleStoreCache,
  };
}

/** Generator factory for an interactive fiction PageSequence. */
export function* createInterviewPageSequence<
  I extends Interview<any>
>(options: {
  interview: I;
  taleStoreCache: TaleStoreCache<I>;
}): PageSequence<JSX.Element> {
  const { interview, taleStoreCache } = options;

  // create a comparator for tale priority order
  const priorityOrder = createTaleComparator(interview);

  for (;;) {
    // list all taleIds and tales
    const taleEntries = safeEntries(interview);

    // eliminate exhausted tales (that have no more roles to tag)
    const liveTaleEntries = taleEntries.filter(
      ([_, tale]) => !everyRoleTagged(tale.state, tale.roles)
    );

    // ensure some tales are not yet exhausted
    if (liveTaleEntries.length === 0) {
      break;
    }

    // get tale with highest priority
    liveTaleEntries.sort(priorityOrder);
    const [priorityTaleEntry] = liveTaleEntries;

    // yield from the highest priority tale
    const [taleId, tale] = priorityTaleEntry;
    const taleStore = getTaleStore(taleStoreCache, taleId);
    yield* tale(taleStore);
  }
  yield <>Congratulations, you have reached the end of the interview.</>;
  return <>The End</>;
}
