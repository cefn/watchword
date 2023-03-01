import { RootState } from "@lauf/store";

/** Compose a generator function with a `state` property. */
export function withState<
  Fn extends (args: unknown[]) => unknown,
  State extends RootState
>(fn: Fn, state: State) {
  return Object.assign(fn, { state });
}
