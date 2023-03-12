import React from "react";
import ReactDOM from "react-dom/client";
import { ElementSequenceView } from "@watchword/core-react";
import { toElementSequence } from "@watchword/fiction-grammar";
import { pageElementDefs } from "@watchword/fiction-ui-react";
import { createInterviewPageSequence } from "./interview";

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error(`Root element not found`);
}

export const story = () => {
  const pageSequence = createInterviewPageSequence();
  const elementSequence = toElementSequence(pageSequence, pageElementDefs);
  return elementSequence;
};

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ElementSequenceView story={story} />
  </React.StrictMode>
);
