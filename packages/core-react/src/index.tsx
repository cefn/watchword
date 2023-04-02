import { useEffect, useState } from "react";
import { ElementSequence, executeUiLoop } from "@watchword/core";

export interface ElementSequenceViewProps {
  story: () => ElementSequence;
}

export function ElementSequenceView<Event>(props: ElementSequenceViewProps) {
  const { story } = props;

  const [element, setElement] = useState<JSX.Element | null>(null);

  useEffect(() => {
    // in strict mode, this will be run twice, and will (harmlessly) recreate a second story
    const sequence = story();
    void executeUiLoop(sequence, setElement);
  }, []);

  if (element === null) {
    return <p>Story Loading</p>;
  }

  return element;
}
