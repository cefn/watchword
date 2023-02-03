export type Handler<Event> = <E extends Event>(event: E) => void;

/** A factory for a JSX.Element embedding a event handler */
export type ElementFactory<Event> = (handler: Handler<Event>) => JSX.Element;

/** A sequence of component factories (with an event handler param)
 * with next() accepting the event eventually passed to the handler
 */
export type ElementSequence = Generator<ElementFactory<any>, JSX.Element, any>;

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
