import { createMappedGenerator } from "@watchword/core";
import { PageSequence } from "../types";

function addPrefix<Action extends { passage: JSX.Element }>(
  action: Action,
  passageBefore: JSX.Element
): Action {
  return {
    ...action,
    passage: (
      <>
        {passageBefore}
        {action.passage}
      </>
    ),
  };
}

function addSuffix<Action extends { passage: JSX.Element }>(
  action: Action,
  passageAfter: JSX.Element
): Action {
  return {
    ...action,
    passage: (
      <>
        {action.passage}
        {passageAfter}
      </>
    ),
  };
}

export function prefixPassages<Ret>(
  sequence: PageSequence<Ret>,
  title: JSX.Element
): PageSequence<Ret> {
  return createMappedGenerator(sequence, (yielded) => {
    const action = "passage" in yielded ? yielded : { passage: yielded }; // normalise raw JSX to a tell action
    return addPrefix(action, title);
  });
}

export function suffixPassages<Ret>(
  sequence: PageSequence<Ret>,
  title: JSX.Element
): PageSequence<Ret> {
  return createMappedGenerator(sequence, (yielded) => {
    const action = "passage" in yielded ? yielded : { passage: yielded }; // normalise raw JSX to a tell action
    return addSuffix(action, title);
  });
}
