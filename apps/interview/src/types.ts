/** Types in this API are often in pairs like...
 * `R extends Role, Tagged extends R`
 * These represent the Roles declared by the Tale
 * vs. the Roles declared as tagged with Content.
 * This means that the tag() function can be more
 * narrowly typed for just specific items declared.
 * It may be possible to check that all declared
 * roles are tagged in a Tale by inference at compile time.
 */
import { Store } from "@lauf/store";
import { PageSequence } from "@watchword/fiction-grammar";
import { ROLES } from "./data";

/** Role is derived from constant data */
export type Role = (typeof ROLES)[number];

export type RoleTuple<R extends Role> = readonly [R, ...R[]];

export interface TaleState<Stored extends Role> {
  invoked: number;
  active: boolean;
  rolesTagged: Record<Stored, boolean>;
}

/** A watchable TaleState (a partition of the Interview store with state for
 * just one Tale)*/
export type TaleStore<Stored extends Role> = Store<TaleState<Stored>>;

export type Beat<out Tagged extends Role> = <Stored extends Role>(
  store: TaleStore<Tagged | Stored>
) => PageSequence<void>;

export type Arc<Tagged extends Role> = Beat<Tagged> & {
  roles: RoleTuple<Tagged>;
};

export type Tale<Stored extends Role, Tagged extends Stored> = Beat<Tagged> & {
  roles: RoleTuple<Stored>;
  state: TaleState<Stored>;
};

/** Utility type to support rich or terse content.
 * Either through a generator of JSX.Elements or just a raw JSX.Element */
export type Content<Tagged extends Role> = Beat<Tagged> | JSX.Element;

/** Utility type to define a non-inferential, non-empty Content tuple */
export type ContentTuple<Tagged extends Role> = [
  Content<Tagged>,
  ...Content<Tagged>[]
];

export type Predicate = <Stored extends Role>(
  store: TaleStore<Stored>
) => boolean;
