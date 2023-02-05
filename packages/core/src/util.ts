import { InferEntry, ValueOf } from "./types";

/** Utility function for turning one generator into another by mapping
 * IteratorResult  */
export function createMappedGenerator<Yielded, Returned, Nexted, MappedYielded>(
  generator: Generator<Yielded, Returned, Nexted>,
  mapYielded: (yielded: Yielded) => MappedYielded
): Generator<MappedYielded, Returned, Nexted> {
  function mapResult(result: IteratorResult<Yielded, Returned>) {
    const { value, done } = result;
    if (!done) {
      return {
        done,
        value: mapYielded(value),
      };
    }
    return result;
  }

  return {
    [Symbol.iterator]() {
      return this;
    },
    next(...args) {
      return mapResult(generator.next(...args));
    },
    return(value) {
      return mapResult(generator.return(value));
    },
    throw(e) {
      return mapResult(generator.throw(e));
    },
  };
}

/** Create a strictly-typed Object.entries style tuple,
 * from an item and a property key
 */
export function composeEntry<T, K extends keyof T>(
  item: T,
  key: K
): InferEntry<T, K> {
  return [key, item[key]];
}

/** Type-aware alias of Object.entries  */
export function safeEntries<Lookup extends object>(lookup: Lookup) {
  return Object.entries(lookup) as InferEntry<Lookup>[];
}

/** Type-aware alias of Object.values  */
export function safeValues<Lookup extends object>(lookup: Lookup) {
  return Object.values(lookup) as ValueOf<Lookup>[];
}

/** Type-aware alias of Object.keys  */
export function safeKeys<Lookup extends object>(lookup: Lookup) {
  return Object.keys(lookup) as (keyof Lookup)[];
}

/** Create a lookup from a pre-existing lookup and a 'projection' function
 * to create a value for each key.
 */
export function mapFrom<
  From extends object,
  To extends { [K in keyof From]: any }
>(map: From, mapFn: <Key extends keyof From>(key: Key) => To[Key]) {
  const keys = safeKeys(map);
  return Object.fromEntries(keys.map((key) => [key, mapFn(key)])) as {
    [K in keyof From]: To[K];
  };
}

/** Create a lookup from a list of keys and a 'projection' function to create
 * values for each key. */
export function project<Map extends {}>(
  keys: (keyof Map)[],
  mapFn: <Key extends keyof Map>(key: Key) => Map[Key]
) {
  return Object.fromEntries(keys.map((key) => [key, mapFn(key)])) as {
    [K in keyof Map]: Map[K];
  };
}

/** Populate a lookup from a function that creates a value for each key and a
 * list of ids (keys) */
export function initLookup<Id extends string, L>(
  initLookupValue: (item: Id) => L,
  ...ids: Readonly<[Id, ...Id[]]>
) {
  return Object.fromEntries(
    ids.map((id) => [id, initLookupValue(id)])
  ) as Record<Id, L>;
}

/** Transform string to have initial capital letter and lowercase remainder. */
export function capitalize(text: string) {
  const first = text[0];
  const following = text.slice(1);
  return `${first.toUpperCase()}${following.toLowerCase()}`;
}
