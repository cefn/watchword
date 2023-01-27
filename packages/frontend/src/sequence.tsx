import { mapComponentsToSequences } from "@watchword/core";
import { Tell, Prompt } from "./components";

export const { tell, prompt } = mapComponentsToSequences({
  Tell,
  Prompt,
});
