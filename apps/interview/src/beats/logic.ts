import type { Immutable, Store } from "@lauf/store";
import { edit } from "@lauf/store-edit";
import { initLookup, safeValues } from "@watchword/core";
import type {
  TaggingBeat,
  Predicate,
  StringTuple,
  TaleState,
  TaleStore,
  Interview,
} from "./types";

export const taleVisited: Predicate = (store) => store.read().invoked > 1;

export function tagRoles<
  StoredRole extends string,
  TaggedRole extends StoredRole
>(store: TaleStore<StoredRole>, ...roles: StringTuple<TaggedRole>) {
  const rolesSet: TaggedRole[] = [];
  edit(store, (untypedDraft) => {
    // remove after fixing https://github.com/cefn/lauf/issues/214
    const draft = untypedDraft as TaleState<StoredRole>;
    for (const role of roles) {
      if (!draft.tagged.includes(role)) {
        draft.tagged.push(role);
      }
    }
  });
  return rolesSet;
}

export function flagSymbols<StoredRole extends string>(
  store: Store<TaleState<StoredRole>>,
  ...flagged: [symbol, ...symbol[]]
) {
  edit(store, (draft) => {
    for (const item of flagged) {
      if (!draft.flagged.includes(item)) {
        draft.flagged.push(item);
      }
    }
  });
}

export function isBeatExhausted<
  StoredRole extends string,
  TaggedRole extends StoredRole
>(store: TaleStore<StoredRole | TaggedRole>, beat: TaggingBeat<TaggedRole>) {
  const state = store.read();
  const { roles } = beat;
  return everyRoleTagged(state, roles);
}

export function everyRoleTagged<
  StoredRole extends string,
  TaggedRole extends StoredRole
>(
  state: Immutable<TaleState<StoredRole | TaggedRole>>,
  roles: StringTuple<TaggedRole>
) {
  return roles.every((role) =>
    state.tagged.includes(role as Immutable<typeof role>)
  );
}

/** Counts the tales which have tagged each role.  */
export function taleCountsByRole<R extends string, I extends Interview<R>>(
  interview: I
) {
  // list unique roles by traversing all tales' roles
  const roleSet = new Set<R>();
  const tales = Object.values(interview);
  for (const { roles } of tales) {
    for (const role of roles) {
      roleSet.add(role);
    }
  }
  const roles = [...roleSet.values()] as const;

  // throw if no roles
  if (roles.length === 0) {
    throw new Error("Interview tales have no roles!");
  }

  // create counters per role
  const taleCounts = initLookup(() => 0, ...(roles as StringTuple<R>));
  for (const tale of safeValues(interview)) {
    for (const role of tale.state.tagged) {
      taleCounts[role as R] += 1;
    }
  }
  return taleCounts;
}
