import React from "react";
import ReactDOM from "react-dom/client";
import { Tell } from "@watchword/frontend";
import { decorateRawJsx } from "@watchword/core";
import { createActionSequence } from "./stories/goodbye-world";
import { StyledStoryView } from "./StyledStoryView";

export const story = () => {
  const actionSequence = createActionSequence();
  return decorateRawJsx(actionSequence, Tell);
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StyledStoryView story={story} />
  </React.StrictMode>
);
