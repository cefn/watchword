export type Handler<Event> = <E extends Event>(event: E) => void;

/** A factory for a JSX.Element embedding a event handler */
export type ElementFactory<Event> = (handler: Handler<Event>) => JSX.Element;

/** A sequence of component factories (with an event handler param)
 * with next() accepting the event eventually passed to the handler
 */
// TODO CH nexted value should be generic (defaulting to any?) ?
export type ElementSequence = Generator<ElementFactory<any>, JSX.Element, any>;

/** COMMON UTILITY TYPES */

export type MemberOf<Array extends readonly unknown[]> = Array[number];

export type ValueOf<T> = T[keyof T];

export type InferEntry<Lookup, K extends keyof Lookup = keyof Lookup> = {
  [K in keyof Lookup]: [K, Lookup[K]];
}[K];

/** TYPESCRIPT WORKAROUNDS */

// demotes a Generic binding site as a candidate for inference
export type NoInfer<T> = [T][T extends any ? 0 : never];

/** Workaround to encourage editor to show expanded type.
 * from https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type/57683652#57683652
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type GYielded<G extends Generator> = G extends Generator<
  infer Yielded,
  any,
  any
>
  ? Yielded
  : never;
