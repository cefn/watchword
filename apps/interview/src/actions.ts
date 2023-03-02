import {
  Role,
  Arc,
  TaleStore,
  Beat,
  TaleState,
  Predicate,
  ContentTuple,
} from "./types";
import { Store } from "@lauf/store";
import { edit } from "@lauf/store-edit";
import { serveContent } from "./tale";

export function branch<Evidenced extends Role, Question extends string>(
  branches: Record<Question, Arc<Evidenced>>
): Beat<Evidenced> {
  return function* (store: TaleStore<Evidenced>) {};
}

export const taleVisited: Predicate = (store) => store.read().invoked > 1;

export function introBeat<Evidenced extends Role>(
  ...contents: ContentTuple<Evidenced>
): Beat<Evidenced> {
  return function* (store) {
    if (!taleVisited(store)) {
      yield* serveContent(store, ...contents);
    }
  };
}

export function evidence<TaleRole extends Role, Evidenced extends TaleRole>(
  store: Store<TaleState<TaleRole>>,
  ...roles: [Evidenced, ...Evidenced[]]
) {
  edit(store, (untypedDraft) => {
    // remove after fixing https://github.com/cefn/lauf/issues/214
    const draft = untypedDraft as TaleState<TaleRole>;
    for (const role of roles) {
      draft.rolesVisited[role] = true;
    }
  });
}
