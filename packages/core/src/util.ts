export function decorateSequence<Yielded, Returned, Nexted, Decorated>(
  generator: Generator<Yielded, Returned, Nexted>,
  decorate: (yielded: Yielded) => Decorated
): Generator<Decorated, Returned, Nexted> {
  function mapResult(result: IteratorResult<Yielded, Returned>) {
    const { value, done } = result;
    if (!done) {
      return {
        done,
        value: decorate(value),
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

export type InferEntry<Lookup> = keyof Lookup extends keyof Lookup
  ? [keyof Lookup, Lookup[keyof Lookup]]
  : never;
