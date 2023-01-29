/** A chooser callback to be triggered by a JSX.Element UI with an event (e.g. a
 * choice guiding the story) */
export type EventHandler<Event> = (event: Event) => void;

/** A factory for a JSX.Element embedding a event handler */
export type ElementFactory<Event> = <E extends Event>(
  handler: EventHandler<E>
) => JSX.Element;

/** A sequence of component factories (with an event handler param)
 * with next() accepting the event eventually passed to the handler
 */
export type ElementSequence<Event> = Generator<
  ElementFactory<Event>,
  JSX.Element,
  Event
>;

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
