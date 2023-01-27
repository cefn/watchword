import { ActionSequence } from "@watchword/core";

export function* story(): ActionSequence {
  yield <>This is text 1</>;
  yield <>This is text 2</>;
}
