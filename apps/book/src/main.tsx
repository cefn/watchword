import { toElementSequence } from "@watchword/ui-fiction";
import React from "react";
import ReactDOM from "react-dom/client";
import { createPageSequence } from "./stories/goodbye-world";
import { StyledSequenceView } from "./StyledSequenceView";

export const story = () => {
  const pageSequence = createPageSequence();
  const elementSequence = toElementSequence(pageSequence);
  return elementSequence;
};

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error(`Root element not found`);
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <StyledSequenceView story={story} />
  </React.StrictMode>
);
