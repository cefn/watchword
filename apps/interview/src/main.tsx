import React from "react";
import ReactDOM from "react-dom/client";
import { ElementSequenceView } from "@watchword/core-react";
import { ElementSequence } from "@watchword/core";

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error(`Root element not found`);
}

function* story(): ElementSequence {
  yield () => <p>Hello</p>
  return <>End</>
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ElementSequenceView story={story} />
  </React.StrictMode>
);
