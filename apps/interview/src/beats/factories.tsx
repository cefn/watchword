import type { Immutable } from "@lauf/store";
import { edit } from "@lauf/store-edit";
import { safeEntries } from "@watchword/core";
import { PageSequence, prompt } from "@watchword/fiction-grammar";
import { flagSymbols, tagRoles, isBeatExhausted } from "./logic";
import type {
  Tale,
  TaleState,
  TaleStore,
  StringTuple,
  Beat,
  TaggingBeat,
  FlaggingBeat,
  ContentTuple,
} from "./types";

export function initTaleState<StoredRole extends string>(): Immutable<
  TaleState<StoredRole>
> {
  return {
    active: false,
    invoked: 0,
    flagged: [],
    tagged: [],
  };
}

/** Creates a Tale - an annotated Generator with a list of roles it can tag and
 * a corresponding store for its runtime state.
 * */
export function tale<StoredRole extends string, TaggedRole extends StoredRole>(
  roles: StringTuple<StoredRole>,
  ...contents: ContentTuple<TaggedRole>
): Tale<StoredRole, TaggedRole> {
  // Update state to record entering, leaving.
  const beat: Beat<TaggedRole> = function* (store) {
    notifyEnteredTale(store);
    yield* serveContent(store, ...contents);
    notifyExitedTale(store);
  };
  // Compose initial state for the Tale
  const state = initTaleState<StoredRole>();
  return Object.assign(beat, { roles, state });
}

/** Creates a beat that tags roles at the end of its run. */
export function tag<TaggedRole extends string>(
  roles: StringTuple<TaggedRole>,
  ...contents: ContentTuple<TaggedRole>
): TaggingBeat<TaggedRole> {
  // Tag roles on leaving.
  const taggingBeat: Beat<TaggedRole> = function* (store) {
    yield* serveContent(store, ...contents);
    tagRoles(store, ...roles);
  };
  return Object.assign(taggingBeat, { roles });
}

/** Create a beat that flags a symbol in the store at the start of its run. */
export function flag<TaggedRole extends string>(
  beat: Beat<TaggedRole>,
  flagged = Symbol()
): FlaggingBeat<TaggedRole> {
  const wrapper: Beat<TaggedRole> = function* (store) {
    flagSymbols(store, flagged);
    return yield* beat(store);
  };
  return Object.assign(wrapper, {
    flagged,
  });
}

/** Creates a beat that runs just once, writing a flag to the TaleStore. */
export function flagOnce<TaggedRole extends string>(
  beat: Beat<TaggedRole>,
  flagged = Symbol()
) {
  const flaggingBeat: FlaggingBeat<TaggedRole> = flag(function* (store) {
    yield* beat(store);
  }, flagged);

  const beatOnce: Beat<TaggedRole> = function* (store) {
    const state = store.read();
    if (!state.flagged.includes(flagged)) {
      yield* flaggingBeat(store);
    }
  };

  return Object.assign(beatOnce, {
    flagged,
  });
}

/** Equivalent to tag, but only yields pages once, then skips its pages. */
export function tagOnce<TaggedRole extends string>(
  tagged: StringTuple<TaggedRole>,
  ...contents: ContentTuple<TaggedRole>
) {
  const taggingBeat = tag(tagged, ...contents);
  const flaggingBeat = flagOnce<TaggedRole>(taggingBeat);
  return Object.assign(flaggingBeat, {
    tagged,
  });
}

/** A structure for content nested inside questions. */
export function branch<TaggedRole extends string, Question extends string>(
  branches: Record<Question, TaggingBeat<TaggedRole>>
): Beat<TaggedRole> {
  return function* <StoredRole extends string>(
    store: TaleStore<TaggedRole | StoredRole>
  ) {
    // eliminate exhausted TaggingBeats
    const branchEntries = safeEntries(branches);
    const liveEntries = branchEntries.filter(
      ([_, arc]) => !isBeatExhausted(store, arc)
    );

    // skip branch if all are exhausted
    if (liveEntries.length === 0) {
      return;
    }

    // populate both prompt choices and content from branch keys
    const choices = Object.fromEntries(
      liveEntries.map(([question]) => [question, <>{question}</>])
    ) as {
      [Q in Question]: JSX.Element;
    };

    // yield to prompt
    const chosenQuestion = yield* prompt(<>Choose a question</>, choices);
    const chosenBranch = branches[chosenQuestion];

    // route to chosen branch
    const sequence = chosenBranch(store);
    yield* sequence;
  };
}

export function* serveContent<
  StoredRole extends string,
  TaggedRole extends StoredRole
>(
  store: TaleStore<StoredRole>,
  ...contents: ContentTuple<TaggedRole>
): PageSequence<void> {
  for (const content of contents) {
    if (typeof content === "function") {
      // it's a beat
      yield* content(store);
    } else {
      // it's a fragment
      yield content;
    }
  }
}

export function notifyEnteredTale<R extends string>(store: TaleStore<R>) {
  edit(store, (draft) => {
    draft.invoked++;
    draft.active = true;
  });
}

export function notifyExitedTale<R extends string>(store: TaleStore<R>) {
  edit(store, (draft) => {
    draft.active = false;
  });
}
