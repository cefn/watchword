import { InferEntry } from "./types";

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

export type MemberOf<Array extends readonly unknown[]> = Array[number];

export type ValueOf<T> = T[keyof T];

export function safeEntries<Lookup extends object>(lookup: Lookup) {
  return Object.entries(lookup) as InferEntry<Lookup>[];
}

export function safeValues<Lookup extends object>(lookup: Lookup) {
  return Object.values(lookup) as ValueOf<Lookup>[];
}

export function safeKeys<Lookup extends object>(lookup: Lookup) {
  return Object.keys(lookup) as (keyof Lookup)[];
}

export function mapFrom<
  From extends object,
  To extends { [K in keyof From]: any }
>(map: From, mapFn: <Key extends keyof From>(key: Key) => To[Key]) {
  const keys = safeKeys(map);
  return Object.fromEntries(keys.map((key) => [key, mapFn(key)])) as {
    [K in keyof From]: To[K];
  };
}

export function project<Map extends {}>(
  keys: (keyof Map)[],
  mapFn: <Key extends keyof Map>(key: Key) => Map[Key]
) {
  return Object.fromEntries(keys.map((key) => [key, mapFn(key)])) as {
    [K in keyof Map]: Map[K];
  };
}

export function initLookup<Id extends string, L>(
  initLookupValue: (item: Id) => L,
  ...ids: Readonly<[Id, ...Id[]]>
) {
  return Object.fromEntries(
    ids.map((id) => [id, initLookupValue(id)])
  ) as Record<Id, L>;
}
