/** Creates a combined state for the whole interview.
 * The InterviewState points to all the individual TaleStates
 * The stores point to partitioned stores from the Store<InterviewState>
 * with each Tale's state reference tracking changes in its partition.
 */
import { createStore, createStorePartition, Store } from "@lauf/store";
import {
  safeKeys,
  safeEntries,
  safeValues,
  initLookup,
  MemberOf,
  InferEntry,
} from "@watchword/core";
import type { PageSequence } from "@watchword/fiction-grammar";
import type { Tale } from "./types";
import { INTERVIEW, ROLES } from "./data";
import { isArcExhausted } from "./logic";

type Interview = typeof INTERVIEW;
type TaleId = keyof Interview;
type StateById<Id extends TaleId> = Interview[Id]["state"];
type InterviewState = {
  [Id in TaleId]: StateById<Id>;
};
type InterviewEntry = InferEntry<Interview>;

/** A store partition for each tale */
type TaleStores = {
  [Id in TaleId]: Store<StateById<Id>>;
};

/** Combine all the tales' states into a single map. */
function initInterviewState() {
  return Object.fromEntries(
    safeKeys(INTERVIEW).map((key) => [key, INTERVIEW[key].state])
  ) as InterviewState;
}

function initTaleStores(interviewStore: Store<InterviewState>) {
  return Object.fromEntries(
    safeKeys(INTERVIEW).map((key) => [
      key,
      createStorePartition(interviewStore, key),
    ])
  ) as TaleStores;
}

// TODO pass TALE_MAP as an instance, not a global def.
// until TALE_MAP is non-global the below has to be non-global too

// initialise the interview store
export const INTERVIEW_STORE = createStore(initInterviewState());

// partition stores per tale
export const TALE_STORES = initTaleStores(INTERVIEW_STORE);

// tales track their store's state
for (const [taleId, taleStore] of safeEntries(TALE_STORES)) {
  taleStore.watch((state) => {
    INTERVIEW[taleId].state = state;
  });
}

function getTaleStore<Id extends TaleId>(id: Id) {
  // tale inferred from id
  type InferredTale = Interview[Id];
  // store is first arg to tale
  type InferredStore = Parameters<InferredTale>[0];
  // typesafe return value
  return TALE_STORES[id] as InferredStore;
}

function interviewTagged() {
  const tagCounts = initLookup(() => 0, ...ROLES);
  for (const tale of safeValues(INTERVIEW)) {
    for (const role of tale.state.tagged) {
      tagCounts[role] += 1;
    }
  }
  return tagCounts;
}

function taleUntagged<T extends Tale<any, any>>(
  tale: T
): MemberOf<T["roles"]>[] {
  return tale.roles.filter((role) => !tale.state.tagged.has(role));
}

/** Used to prioritise the next Tale to consider in outer
 * Interview loop. */
function comparePriority([, taleA]: InterviewEntry, [, taleB]: InterviewEntry) {
  // least invoked tale
  const { invoked: invokeCountA } = taleA.state;
  const { invoked: invokeCountB } = taleA.state;
  if (invokeCountA !== invokeCountB) {
    return invokeCountA - invokeCountB;
  }

  // figure out roles not yet evidenced
  const untaggedA = taleUntagged(taleA);
  const untaggedB = taleUntagged(taleB);

  // tale with most roles still to be evidenced
  if (untaggedA.length !== untaggedB.length) {
    return untaggedA.length - untaggedB.length;
  }

  // tale with globally least evidenced role
  const tagCounts = interviewTagged();
  const leastCountedA = Math.min(
    Number.MAX_SAFE_INTEGER,
    ...untaggedA.map((role) => tagCounts[role])
  );
  const leastCountedB = Math.min(
    Number.MAX_SAFE_INTEGER,
    ...untaggedB.map((role) => tagCounts[role])
  );
  if (leastCountedA !== leastCountedB) {
    return leastCountedB - leastCountedA;
  }

  // fallback order
  return 0;
}

export function* createInterviewPageSequence(): PageSequence<JSX.Element> {
  for (;;) {
    // load all tales
    const taleEntries = safeEntries(INTERVIEW);

    // eliminate exhausted tales
    const liveEntries = taleEntries.filter(([_, tale]) => {
      return !isArcExhausted(tale.state, tale);
    });

    // check if tales remain
    if (liveEntries.length === 0) {
      break;
    }

    // sort by tail priority
    liveEntries.sort(comparePriority);
    // yield from the highest priority tale (passing its store)
    const [priorityTale] = liveEntries;
    const [taleId, tale] = priorityTale;
    const taleStore = getTaleStore(taleId);
    console.log("Yielding from tale");
    yield* tale(taleStore);
  }
  return <>Congratulations, you have reached the end of the interview.</>;
}
