import { edit } from "@lauf/store-edit";
import { safeEntries } from "@watchword/core";
import { PageSequence, prompt } from "@watchword/fiction-grammar";
import { flagSymbols, isArcExhausted, tagRoles } from "./logic";
import type {
  Arc,
  Beat,
  ContentTuple,
  FlagBeat,
  Role,
  RoleTuple,
  Tale,
  TaleState,
  TaleStore,
} from "./types";

/** Creates a Tale - an annotated Generator having a list of roles it evidences
 * and a store for its runtime state.
 * */
export function tale<Stored extends Role, Tagged extends Stored>(
  roles: RoleTuple<Stored>,
  ...contents: ContentTuple<Tagged>
): Tale<Stored, Tagged> {
  // Update state on entering, leaving.
  const beat: Beat<Tagged> = function* (store) {
    notifyEntered(store);
    yield* serveContent(store, ...contents);
    notifyExited(store);
  };
  // Initial state for the Tale
  const state: TaleState<Stored> = {
    active: false,
    invoked: 0,
    flagged: new Set(),
    tagged: new Set(),
  };
  return Object.assign(beat, { roles, state });
}

/** Create a beat annotated with roles it evidences. */
export function arc<Tagged extends Role>(
  roles: RoleTuple<Tagged>,
  ...contents: ContentTuple<Tagged>
): Arc<Tagged> {
  // Update state on entering, leaving.
  const beat: Beat<Tagged> = function* (store) {
    yield* serveContent(store, ...contents);
    tagRoles(store, ...roles);
  };
  return Object.assign(beat, { roles });
}

/** A beat that flags a symbol in the store as soon as it is run. */
export function flagBeat<Tagged extends Role>(
  beat: Beat<Tagged>,
  flag: symbol = Symbol()
): FlagBeat<Tagged> {
  const flagBeat: Beat<Tagged> = function* (store) {
    flagSymbols(store, flag);
    return yield* beat(store);
  };
  return Object.assign(flagBeat, {
    flag,
  });
}

/** An arc that is only ever run once per Tale,
 * guarded by a symbol in the TaleState  */
export function lazyArc<Tagged extends Role>(
  roles: RoleTuple<Tagged>,
  ...contents: ContentTuple<Tagged>
) {
  // tagged beat has roles, tags them after run
  const taggedBeat = arc(roles, ...contents);

  // flagged beat defines unique symbol, flags it before run
  const flaggedBeat = flagBeat<Tagged>(function* (store) {
    yield* taggedBeat(store);
  });
  const { flag } = flaggedBeat;

  // lazy beat runs only if flag not yet set
  const lazyBeat: Beat<Tagged> = function* (store) {
    const state = store.read();
    if (!state.flagged.has(flag)) {
      yield* flaggedBeat(store);
    }
  };

  // Assign roles and unique flag for inspection
  return Object.assign(lazyBeat, {
    roles,
    flag,
  });
}

/** A structure for content nested inside questions. */
export function branch<Tagged extends Role, Question extends string>(
  branches: Record<Question, Arc<Tagged>>
): Beat<Tagged> {
  return function* (store) {
    const branchEntries = safeEntries(branches);
    const liveEntries = branchEntries.filter(
      ([_, arc]) => !isArcExhausted(store.read(), arc)
    );
    if (liveEntries.length > 0) {
      const choices = Object.fromEntries(
        liveEntries.map(([question]) => [question, <>{question}</>])
      ) as {
        [Q in Question]: JSX.Element;
      };
      const chosenQuestion = yield* prompt(<>Choose a question</>, choices);
      const chosenBranch = branches[chosenQuestion];
      yield* chosenBranch(store);
    }
  };
}

export function* serveContent<Stored extends Role, Tagged extends Stored>(
  store: TaleStore<Stored>,
  ...contents: ContentTuple<Tagged>
): PageSequence<void> {
  for (const content of contents) {
    if (typeof content === "function") {
      yield* content(store);
    } else {
      yield content;
    }
  }
}

function notifyEntered<R extends Role>(store: TaleStore<R>) {
  edit(store, (draft) => {
    draft.invoked++;
    draft.active = true;
  });
}

function notifyExited<R extends Role>(store: TaleStore<R>) {
  edit(store, (draft) => {
    draft.active = false;
  });
}
