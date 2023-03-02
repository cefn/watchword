import { Store } from "@lauf/store";
import { MemberOf, NoInfer } from "@watchword/core";
import { PageSequence } from "@watchword/fiction-grammar";
import { ROLES, TALES } from "./data";

/** Role is derived from constant data */
export type Role = (typeof ROLES)[number];
/** TaleId is derived from constant data */
export type TaleId = keyof typeof TALES;

/** Derive types by TaleId */
export type TaleById<Id extends TaleId> = (typeof TALES)[Id];
export type TaleRoleById<Id extends TaleId> = MemberOf<TaleById<Id>["roles"]>;

/** A story 'beat' is the smallest structural element of interactivity.
 * Beat is a generator function interface with no other properties.
 * It's invoked passing the store of its parent Tale with an implied
 * set of Evidenced roles. */
export type Beat<Evidenced extends Role> = (
  store: TaleStore<Evidenced>
) => PageSequence<void>;

/** An Arc is a Beat with a property containing the roles that it evidences. */
export interface Arc<Evidenced extends Role> extends Beat<Evidenced> {
  roles: readonly [Evidenced, ...Evidenced[]];
}

/** A Tale is an Arc with properties for both roles and runtime state.
 * top-level properties of TALES are expected to be of type Tale. */
export interface Tale<Evidenced extends Role> extends Arc<Evidenced> {
  state: TaleState<Evidenced>;
}

/** Utility type to support rich or terse content.
 * Either through a generator of JSX.Elements or just a raw JSX.Element */
export type Content<Evidenced extends Role> = Beat<Evidenced> | JSX.Element;

/** Utility type to define a non-inferential, non-empty Content tuple */
export type ContentTuple<Evidenced extends Role> = [
  Content<NoInfer<Evidenced>>,
  ...Content<NoInfer<Evidenced>>[]
];

/** Used to track the runtime progress of a Tale. */
export interface TaleState<Evidenced extends Role> {
  invoked: number;
  active: boolean;
  rolesVisited: Record<Evidenced, boolean>;
}

/** Combines the runtime progress of all Tales, by TaleId */
export type InterviewState = {
  [Id in TaleId]: TaleState<TaleRoleById<Id>>;
};

/** A watchable TaleState (a partition of the Interview store with state for
 * just one Tale)*/
export type TaleStore<Evidenced extends Role> = Store<TaleState<Evidenced>>;

/** A watchable state combining all the TaleStates from TALES in a single store. */
export type InterviewStore = Store<InterviewState>;

/** Utility type for filters that consume some store. */
export type Predicate = <Evidenced extends Role>(
  store: TaleStore<Evidenced>
) => boolean;
