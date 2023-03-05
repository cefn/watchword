import { edit } from "@lauf/store-edit";
import { arc } from "./tale";
import {
  Arc,
  Beat,
  ContentTuple,
  Predicate,
  Role,
  RoleTuple,
  TaleState,
  TaleStore,
} from "./types";

export const taleVisited: Predicate = (store) => store.read().invoked > 1;

export function isTagged<R extends Role>(store: TaleStore<R>, role: R) {
  return store.read().rolesTagged[role];
}

export function tag<Stored extends Role, Tagged extends Stored>(
  store: TaleStore<Stored>,
  ...roles: RoleTuple<Tagged>
) {
  edit(store, (untypedDraft) => {
    // remove after fixing https://github.com/cefn/lauf/issues/214
    const draft = untypedDraft as TaleState<Stored>;
    for (const role of roles) {
      draft.rolesTagged[role] = true;
    }
  });
}

export function introArc<Tagged extends Role>(
  roles: RoleTuple<Tagged>,
  ...contents: ContentTuple<Tagged>
): Arc<Tagged> {
  const beat: Beat<Tagged> = function* (store) {
    // create arc, yield to it, if first visit
    if (taleVisited(store)) {
      // rely on arc beat logic to notify roles
      const arcBeat = arc(roles, ...contents);
      yield* arcBeat(store);
    }
  };
  return Object.assign({
    beat,
    roles,
  });
}

export function branch<Tagged extends Role, Question extends string>(
  branches: Record<Question, Arc<Tagged>>
): Beat<Tagged> {
  const beat: Beat<Tagged> = function* (store) {};
  return beat;
}
