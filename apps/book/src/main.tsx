import React from "react";
import ReactDOM from "react-dom/client";
import { StoryView, Tell } from "@watchword/frontend";
import { decorateTerseSequence } from "@watchword/core";
import { story } from "./stories/goodbye-world";

export const longStory = () => {
  const terseSequence = story();
  return decorateTerseSequence(terseSequence, Tell);
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoryView story={longStory} />
  </React.StrictMode>
);
