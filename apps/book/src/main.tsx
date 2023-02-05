import { toElementSequence } from "@watchword/fiction-grammar";
import { pageElementDefs } from "@watchword/fiction-ui-react";
import { ElementSequenceView } from "@watchword/core-react";
import React from "react";
import ReactDOM from "react-dom/client";

import { createPageSequence } from "./stories/fiction/cloak-of-darkness";

import "@watchword/fiction-ui-react/css";

export const story = () => {
  const pageSequence = createPageSequence();
  const elementSequence = toElementSequence(pageSequence, pageElementDefs);
  return elementSequence;
};

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error(`Root element not found`);
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ElementSequenceView story={story} />
  </React.StrictMode>
);
