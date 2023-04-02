/** Types in this API are often in pairs like...
 * `StoredRole extends string, TaggedRole extends StoredRole`
 * These represent the Roles declared by the Tale
 * vs. the Roles declared as tagged by the Content.
 * This means that the tag() function can be more
 * narrowly typed for just specific items declared.
 * This also makes it possible to check that all declared
 * roles are tagged in a Tale by inference at compile time
 * (see the debugging types in roleCoverage.ts).
 */
import type { Immutable, Store } from "@lauf/store";
import { InferEntry } from "@watchword/core";
import type { PageSequence } from "@watchword/fiction-grammar";

// CORE TYPES

export interface TaleState<StoredRole extends string> {
  invoked: number;
  active: boolean;
  flagged: symbol[]; // symbols flagged so far
  tagged: StoredRole[]; // roles evidenced so far
}

/** A watchable TaleState (a partition of the Interview store with state for
 * just one Tale)*/
export type TaleStore<StoredRole extends string> = Store<TaleState<StoredRole>>;

/** A story unit (scriptwriters use this term) */
export type Beat<out TaggedRole extends string> = <StoredRole extends string>(
  store: TaleStore<TaggedRole | StoredRole>
) => PageSequence<void>;

/** A story unit with roles and a record of its execution. */
export type Tale<
  StoredRole extends string,
  TaggedRole extends StoredRole
> = Beat<TaggedRole> & {
  roles: StringTuple<StoredRole>;
  state: Immutable<TaleState<StoredRole>>;
};

export type Interview<R extends string> = Record<string, Tale<R, R>>;

// UTILITY TYPES

export type StringTuple<R extends string> = readonly [R, ...R[]];

/** A story unit with associated roles. */
export type TaggingBeat<TaggedRole extends string> = Beat<TaggedRole> & {
  roles: StringTuple<TaggedRole>;
};

export type FlaggingBeat<TaggedRole extends string> = Beat<TaggedRole> & {
  flagged: symbol; //TODO collision in naming with the related field `flagged` in TaleState
};

/** Utility type to support rich or terse content.
 * Either through a generator of JSX.Elements or just a raw JSX.Element */
export type Content<TaggedRole extends string> = Beat<TaggedRole> | JSX.Element;

/** Utility type to define a non-inferential, non-empty Content tuple */
export type ContentTuple<TaggedRole extends string> = [
  Content<TaggedRole>,
  ...Content<TaggedRole>[]
];

export type Predicate = <StoredRole extends string>(
  store: TaleStore<StoredRole>
) => boolean;

// TYPES INFERRED FROM INTERVIEW

export type TaleId<I extends Interview<any>> = keyof I;

export type StateById<
  I extends Interview<any>,
  Id extends TaleId<I>
> = I[Id]["state"];

export type InterviewState<I extends Interview<any>> = {
  [Id in TaleId<I>]: StateById<I, Id>;
};

export type InterviewEntry<I extends Interview<any>> = InferEntry<I>;

/** A lookup having a store partition for each tale */
export type TaleStoreCache<I extends Interview<any>> = {
  [Id in TaleId<I>]: Store<StateById<I, Id>>;
};
