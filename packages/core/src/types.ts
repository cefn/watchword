export type Handler<Event> = <E extends Event>(event: E) => void;

/** A factory for a JSX.Element embedding a event handler */
export type ElementFactory<Event> = (handler: Handler<Event>) => JSX.Element;

/** A sequence of component factories (with an event handler param)
 * with next() accepting the event eventually passed to the handler
 */
// TODO CH nexted value should be generic (defaulting to any?) ?
export type ElementSequence = Generator<ElementFactory<any>, JSX.Element, any>;

// demotes a Generic binding site as a candidate for inference
export type NoInfer<T> = [T][T extends any ? 0 : never];

export type InferEntry<Lookup> = keyof Lookup extends keyof Lookup
  ? [keyof Lookup, Lookup[keyof Lookup]]
  : never;

export type GYielded<G extends Generator> = G extends Generator<
  infer Yielded,
  any,
  any
>
  ? Yielded
  : never;
