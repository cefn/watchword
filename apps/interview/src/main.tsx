import React from "react";
import ReactDOM from "react-dom/client";
import { ElementSequenceView } from "@watchword/core-react";
import { toElementSequence } from "@watchword/fiction-grammar";
import { pageElementDefs } from "@watchword/fiction-ui-react";
import {
  createInterviewModel,
  createInterviewPageSequence,
} from "./beats/interview";
import { INTERVIEW } from "./content";
import { RoleFigGrid } from "./components/RoleFigGrid";

// import "@watchword/fiction-ui-react/css";

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error(`Root element not found`);
}

const interviewModel = createInterviewModel(INTERVIEW);

export const story = () => {
  const pageSequence = createInterviewPageSequence(interviewModel);
  const elementSequence = toElementSequence(pageSequence, pageElementDefs);
  return elementSequence;
};

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ElementSequenceView story={story} />
    <RoleFigGrid {...interviewModel} />
  </React.StrictMode>
);
