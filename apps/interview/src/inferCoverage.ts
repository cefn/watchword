import type { Tale } from "./types";
import type { INTERVIEW } from "./data";

export type InferUntagged<T extends Tale<any, any>> = T extends Tale<
  infer Stored,
  infer Tagged
>
  ? Exclude<Stored, Tagged>
  : never;

export type MissingTags = {
  [K in keyof typeof INTERVIEW]: InferUntagged<(typeof INTERVIEW)[K]>;
};

export type Exhaustiveness = {
  [K in keyof typeof INTERVIEW]: InferUntagged<
    (typeof INTERVIEW)[K]
  > extends never
    ? true
    : false;
};
