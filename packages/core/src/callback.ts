import { ElementFactory } from "./types";

/** Casts the value of a yield expression to match the event handler in the
 * yielded ElementFactory. Typescript enforces the type of event passed to the
 * handler, and watchword logic ensures that the event passed to the handler is
 * passed back to next().
 */
export function* handle<Event>(
  elementFactory: ElementFactory<Event>
): Generator<ElementFactory<Event>, Event, any> {
  const event = yield elementFactory;
  return event as Event;
}
