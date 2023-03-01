import { Store } from "@lauf/store";
import { MemberOf } from "@watchword/core";
import { PageSequence } from "@watchword/fiction-grammar";
import { ROLES, TALES } from "./data";

/** Role is derived from constant data */
export type Role = (typeof ROLES)[number];
/** TaleId is derived from constant data */
export type TaleId = keyof typeof TALES;

/** Derive types by TaleId */
export type TaleById<Id extends TaleId> = (typeof TALES)[Id];
export type TaleRoleById<Id extends TaleId> = MemberOf<TaleById<Id>["roles"]>;

/** The smallest structural element of interactivity - a Story Beat is a generator for one or more
 * elements of content and has no annotations. */
export type Beat<Evidenced extends Role> = (
  store: TaleStore<Evidenced>
) => PageSequence<void>;

/** An Arc is a sequence annotated with roles it evidences.
 * It's invoked passing the store of its parent Tale. */
export type Arc<Evidenced extends Role> = Beat<Evidenced> & {
  roles: readonly [Evidenced, ...Evidenced[]];
};

/** A Tale is a sequence annotated with roles it evidences
 * and a TaleState to track its runtime progress, used as a
 * top-level property of TALES. */
export type Tale<Evidenced extends Role> = Arc<Evidenced> & {
  state: TaleState<Evidenced>;
};

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

export type TaleStore<Evidenced extends Role> = Store<TaleState<Evidenced>>;

export type InterviewStore = Store<InterviewState>;

export type Predicate = <Evidenced extends Role>(
  store: TaleStore<Evidenced>
) => boolean;
