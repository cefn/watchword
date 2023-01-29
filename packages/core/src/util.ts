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
