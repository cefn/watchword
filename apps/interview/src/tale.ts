import { edit } from "@lauf/store-edit";
import { mapFrom, NoInfer } from "@watchword/core";
import {
  Role,
  Tale,
  Arc,
  TaleState,
  TaleStore,
  Beat,
  ContentTuple,
  RoleTuple,
} from "./types";
import { evidence } from "./actions";

/** Creates an Arc - an annotated Generator which evidences a list of roles to
 * the TaleStore before it returns. Inference from `roles` and `beats` is
 * blocked - should be driven by context
 * */
export function arc<
  AncestorRole extends Role,
  DescendantRole extends AncestorRole
>(
  roles: RoleTuple<DescendantRole>,
  ...contents: ContentTuple<NoInfer<AncestorRole>>
): Arc<AncestorRole> {
  const beat: Beat<AncestorRole> = function* (store) {
    // visit the content
    yield* serveContent(store, ...contents);
    // evidence the roles from the content
    for (const role of roles) {
      evidence(store, ...roles);
    }
  };
  return Object.assign(beat, { roles });
}

/** Creates a Tale - an annotated Generator having a list of roles it evidences
 * and a store for its runtime state. Inference from `contents` is blocked as `roles`
 * should drive child type not the reverse.
 * */
export function tale<AncestorRole extends Role>(
  roles: RoleTuple<AncestorRole>,
  ...contents: ContentTuple<NoInfer<AncestorRole>>
): Tale<AncestorRole> {
  // Update state on entering, leaving.
  const beat: Beat<AncestorRole> = function* (store) {
    notifyEntered(store);
    yield* serveContent(store, ...contents);
    notifyExited(store);
  };
  // Initial state for the Tale
  const state: TaleState<AncestorRole> = {
    active: false,
    invoked: 0,
    rolesVisited: mapFrom(roles, () => false),
  };
  return Object.assign(beat, { roles, state });
}

export function* serveContent<Evidenced extends Role>(
  store: TaleStore<Evidenced>,
  ...contents: ContentTuple<Evidenced>
) {
  for (const content of contents) {
    if (typeof content === "function") {
      yield* content(store); // a generator
    } else {
      yield content; // raw JSX
    }
  }
}

function notifyEntered(store: TaleStore<any>) {
  edit(store, (draft) => {
    draft.invoked++;
    draft.active = true;
  });
}

function notifyExited(store: TaleStore<any>) {
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
