import { useEffect, useState } from "react";
import {
  PageMakerSequence,
  PageSequenceMoment,
  completeAllMoments,
} from "@watchword/core";

export function StoryView<Choice, Ending>(props: {
  story: () => PageMakerSequence<Choice, Ending>;
}) {
  const { story } = props;

  const [moment, setMoment] = useState<PageSequenceMoment<Ending> | null>(null);

  useEffect(() => {
    // in strict mode, this will be run twice, and will recreate a second story
    const sequence = story();
    void completeAllMoments(sequence, setMoment);
  }, []);

  if (moment === null) {
    return <p>Story Loading</p>;
  }

  if ("ending" in moment) {
    return <p>The End</p>;
  }

  return moment.page;
}
