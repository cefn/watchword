import { edit } from "@lauf/store-edit";
import { mapFrom, NoInfer } from "@watchword/core";
import { Role, Tale, Arc, TaleState, TaleStore, Beat } from "./types";
import { evidence } from "./actions";

/** Creates an Arc - an annotated Generator which evidences a list of roles to
 * the TaleStore before it returns. Inference from `roles` and `beats` is
 * blocked - should be driven by context
 * */
export function arc<Evidenced extends Role>(
  roles: readonly [NoInfer<Evidenced>, ...NoInfer<Evidenced>[]],
  ...beats: Beat<NoInfer<Evidenced>>[]
): Arc<Evidenced> {
  return Object.assign(
    function* (store: TaleStore<Evidenced>) {
      // visit the beats
      for (const beat of beats) {
        yield* beat(store);
      }
      // evidence the roles
      for (const role of roles) {
        evidence(store, ...roles);
      }
    },
    { roles }
  );
}

/** Creates a Tale - an annotated Generator having a list of roles it evidences
 * and a store for its runtime state. Inference from `beats` is blocked as `roles`
 * should drive child type not the reverse.
 * */
export function tale<Evidenced extends Role>(
  roles: readonly [Evidenced, ...Evidenced[]],
  ...beats: Beat<NoInfer<Evidenced>>[] // NoInfer - should drive children not the reverse
): Tale<Evidenced> {
  const rootTaleFn = function* (store: TaleStore<Evidenced>) {
    enterTale(store);
    for (const beat of beats) {
      yield* beat(store);
    }
    leaveTale(store);
  };
  const state: TaleState<Evidenced> = {
    active: false,
    invoked: 0,
    rolesVisited: mapFrom(roles, () => false),
  };
  return Object.assign(rootTaleFn, { roles, state });
}

function enterTale(store: TaleStore<any>) {
  edit(store, (draft) => {
    draft.invoked++;
    draft.active = true;
  });
}

function leaveTale(store: TaleStore<any>) {
  edit(store, (draft) => {
    draft.active = false;
  });
}

export function taleExhausted<Evidenced extends Role>(tale: Tale<Evidenced>) {
  return arcExhausted(tale, tale.state);
}

/** An Arc is exhausted when the TaleStore records all its roles are already visited.*/
export function arcExhausted<Evidenced extends Role>(
  arc: Arc<Evidenced>,
  state: TaleState<Evidenced>
) {
  const { rolesVisited } = state;
  for (const role of arc.roles) {
    if (!rolesVisited[role]) {
      return false;
    }
  }
  return true;
}
