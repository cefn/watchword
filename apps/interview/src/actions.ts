import { NoInfer } from "@watchword/core";
import { Role, Arc, TaleStore, Beat, TaleState, Predicate } from "./types";
import { Store } from "@lauf/store";
import { edit } from "@lauf/store-edit";

export function branch<Evidenced extends Role, Question extends string>(
  branches: Record<Question, Arc<Evidenced>>
): Beat<Evidenced> {
  return function* (store: TaleStore<Evidenced>) {};
}

export const taleVisited: Predicate<any> = (store) => store.read().invoked > 1;

export function skipBeat<Evidenced extends Role>(
  skip: Predicate<Evidenced>,
  beat: Beat<Evidenced>
): Beat<Evidenced> {
  return function* (store) {
    if (skip(store)) {
      return;
    }
    yield* beat(store);
  };
}

export function introBeat<Evidenced extends Role>(beat: Beat<Evidenced>) {
  return skipBeat<Evidenced>((store) => store.read().invoked > 1, beat);
}

export function evidence<Evidenced extends Role>(
  store: Store<TaleState<Evidenced>>,
  ...roles: [NoInfer<Evidenced>, ...NoInfer<Evidenced>[]]
) {
  edit(store, (untypedDraft) => {
    // remove after fixing https://github.com/cefn/lauf/issues/214
    const draft = untypedDraft as TaleState<Evidenced>;
    for (const role of roles) {
      draft.rolesVisited[role] = true;
    }
  });
}
