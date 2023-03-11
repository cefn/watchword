import type { Tale } from "./types";
import { TALES } from "./data";

export type InferUntagged<T extends Tale<any, any>> = T extends Tale<
  infer Stored,
  infer Tagged
>
  ? Exclude<Stored, Tagged>
  : never;

export type MissingTags = {
  [K in keyof typeof TALES]: InferUntagged<(typeof TALES)[K]>;
};

export type Exhaustiveness = {
  [K in keyof typeof TALES]: InferUntagged<(typeof TALES)[K]> extends never
    ? true
    : false;
};
