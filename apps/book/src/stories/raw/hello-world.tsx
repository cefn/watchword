import { ElementSequence, handle } from "@watchword/core";

export function* story(): ElementSequence {
  const result = yield* handle<3 | 4 | 5>((handler) => (
    <>
      <button onClick={() => handler(3)}>I choose Three</button>
      <button onClick={() => handler(4)}>I choose Four</button>
      <button onClick={() => handler(5)}>I choose Five</button>
    </>
  ));
  return <>You chose {result}</>;
}
