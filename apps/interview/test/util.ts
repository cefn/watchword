import { createStore } from "@lauf/store";
import { MemberOf } from "@watchword/core";
import { initTaleState } from "../src/beats/factories";

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle */
export function shuffle<T>(arr: T[]) {
  let pos = arr.length;
  while (pos !== 0) {
    const randomIndex = Math.floor(Math.random() * pos);
    pos--;
    [arr[pos], arr[randomIndex]] = [arr[randomIndex], arr[pos]];
  }
}

export async function flushEvents() {
  return sleep(0);
}

export const EXAMPLE_STORED_ROLES = [
  "astronaut",
  "baker",
  "cook",
  "dentist",
] as const;

export const EXAMPLE_TAGGED_ROLES = ["astronaut", "baker", "cook"] as const;

// helpful types corresponding to role lists
export type StoredRole = MemberOf<typeof EXAMPLE_STORED_ROLES>;
export type TaggedRole = MemberOf<typeof EXAMPLE_TAGGED_ROLES>;

export function createExampleTaleStore() {
  return createStore(initTaleState<StoredRole>());
}
