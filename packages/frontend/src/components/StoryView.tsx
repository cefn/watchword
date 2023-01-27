import { useEffect, useState } from "react";
import {
  PageMakerSequence,
  PageSequenceMoment,
  executeMomentLoop,
} from "@watchword/core";

export function StoryView<Choice, Ending>(props: {
  story: () => PageMakerSequence<Choice, Ending>;
}) {
  const { story } = props;

  const [moment, setMoment] = useState<PageSequenceMoment<Ending> | null>(null);

  useEffect(() => {
    // in strict mode, this will be run twice, and will recreate a second story
    const sequence = story();
    void executeMomentLoop(sequence, setMoment);
  }, []);

  return (
    <div className="flex flex-col min-w-full h-screen">
      {renderMoment(moment)}
    </div>
  );
}

function renderMoment<Ending>(moment: PageSequenceMoment<Ending> | null) {
  if (moment === null) {
    return <p>Story Loading</p>;
  }

  if ("ending" in moment) {
    return <p>The End</p>;
  }

  return moment.page;
}
