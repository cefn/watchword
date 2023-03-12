import { Store } from "@lauf/store";
import { edit } from "@lauf/store-edit";
import { NoInfer } from "@watchword/core";
import {
  Arc,
  Predicate,
  Role,
  RoleTuple,
  Tale,
  TaleState,
  TaleStore,
} from "./types";

export const taleVisited: Predicate = (store) => store.read().invoked > 1;

export function tagRoles<Stored extends Role, Tagged extends Stored>(
  store: TaleStore<Stored>,
  ...roles: RoleTuple<Tagged>
) {
  const rolesSet: Tagged[] = [];
  edit(store, (untypedDraft) => {
    // remove after fixing https://github.com/cefn/lauf/issues/214
    const draft = untypedDraft as TaleState<Stored>;
    for (const role of roles) {
      draft.tagged.add(role);
    }
  });
  return rolesSet;
}

export function flagSymbols<Stored extends Role>(
  store: Store<TaleState<Stored>>,
  ...flags: [symbol, ...symbol[]]
) {
  edit(store, (draft) => {
    for (const flag of flags) {
      draft.flagged.add(flag);
    }
  });
}

export function isArcExhausted<Stored extends Role, Tagged extends Stored>(
  state: TaleState<Stored>,
  arc: Arc<Tagged>
) {
  return arc.roles.every((role) => state.tagged.has(role));
}
