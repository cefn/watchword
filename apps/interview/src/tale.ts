import { edit } from "@lauf/store-edit";
import { mapFrom } from "@watchword/core";
import { PageSequence } from "@watchword/fiction-grammar";
import { tag } from "./actions";
import {
  Arc,
  Beat,
  ContentTuple,
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
    rolesVisited: mapFrom(roles, () => false),
  };
  return Object.assign(beat, { roles, state });
}

export function arc<Tagged extends Role>(
  roles: RoleTuple<Tagged>,
  ...contents: ContentTuple<Tagged>
): Arc<Tagged> {
  // Update state on entering, leaving.
  const beat: Beat<Tagged> = function* (store) {
    yield* serveContent(store, ...contents);
    for (const role of roles) {
      tag(store, role);
    }
  };
  return Object.assign(beat, { roles });
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
