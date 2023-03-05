import { edit } from "@lauf/store-edit";
import { Predicate, Role, RoleTuple, TaleState, TaleStore } from "./types";

export const taleVisited: Predicate = (store) => store.read().invoked > 1;

export function tag<Stored extends Role, Tagged extends Stored>(
  store: TaleStore<Stored>,
  ...roles: RoleTuple<Tagged>
) {
  edit(store, (untypedDraft) => {
    // remove after fixing https://github.com/cefn/lauf/issues/214
    const draft = untypedDraft as TaleState<Stored>;
    for (const role of roles) {
      draft.rolesVisited[role] = true;
    }
  });
}
