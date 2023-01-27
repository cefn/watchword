import { TerseSequence } from "@watchword/core";
import { prompt, tell } from "./action";

/** Infers the yielded value from a generator type */
export type GYielded<G extends Generator> = G extends Generator<infer yielded>
  ? yielded
  : never;

/** Infers the next() argument from a generator type */
export type GReturned<G extends Generator> = G extends Generator<
  any,
  infer returned
>
  ? returned
  : never;

/** Infers the returned value from a generator type */
export type GNexted<G extends Generator> = G extends Generator<
  any,
  any,
  infer nexted
>
  ? nexted
  : never;

/** Utility for typing a generator that wraps other Delegated generators. It
 * will yield* to them and consume their return values, but it has its own
 * return type.
 */
export type DelegatingGenerator<Delegated extends Generator, Ret> = Generator<
  Delegated extends Generator ? GYielded<Delegated> : never,
  Ret,
  any
>;

export type ActionDelegator =
  | TerseSequence
  | ReturnType<typeof tell>
  | ReturnType<typeof prompt>;

export type ActionSequence<Ret = void> = DelegatingGenerator<
  ActionDelegator,
  Ret
>;
