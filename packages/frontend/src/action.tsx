import { createStoryActions } from "@watchword/core";
import { Tell, Prompt } from "./components";

export const { tell, prompt } = createStoryActions({
  Tell,
  Prompt,
});
