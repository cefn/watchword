import type { Interview, Tale } from "./types";

/** MissingTags by tale.*/
export type UntaggedPerTale<I extends Interview<any>> = {
  [K in keyof I]: TaleUntagged<I[K]>;
};

export type InferTaleStored<T extends Tale<any, any>> = T extends Tale<
  infer StoredRole,
  any
>
  ? StoredRole
  : never;

export type InferTaleTagged<T extends Tale<any, any>> = T extends Tale<
  any,
  infer TaggedRole
>
  ? TaggedRole
  : never;

/** List roles which a tale declares but doesn't tag. */
type TaleUntagged<T extends Tale<any, any>> = Exclude<
  InferTaleStored<T>,
  InferTaleTagged<T>
>;
