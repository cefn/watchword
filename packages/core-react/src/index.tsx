import { useEffect, useState } from "react";
import { ElementSequence, executeUiLoop } from "@watchword/core";

export function ElementSequenceView<Event>(props: {
  story: () => ElementSequence<Event>;
}) {
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
