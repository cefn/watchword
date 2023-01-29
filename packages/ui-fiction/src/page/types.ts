import { GYielded } from "@watchword/core";
import { prompt, tell } from "./sequence";

export type PageSequence<
  Choice extends string = string,
  Ending = JSX.Element
> = Generator<
  | GYielded<ReturnType<typeof tell> | ReturnType<typeof prompt<Choice>>> // page models
  | JSX.Element, // raw static JSX - syntactic sugar for embedding in a tell
  Ending,
  any
>;
