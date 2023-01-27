import { InferEntry } from "@watchword/core";
import { PassagePane } from "./PassagePane";
import { Button } from "react-daisyui";

export function Prompt<Choice extends string>(props: {
  passage: JSX.Element;
  choices: {
    [k in Choice]: JSX.Element;
  };
  choose: (choice: Choice) => void;
}) {
  const { passage, choices, choose } = props;

  const controls = (
    <div className="flex flex-col">
      {Object.entries(choices).map((entry) => {
        const [choiceId, choicePassage] = entry as InferEntry<typeof choices>;
        return (
          <Button
            color="primary"
            className="w-fit m-1"
            onClick={() => choose(choiceId)}
          >
            {choicePassage}
          </Button>
        );
      })}
    </div>
  );

  return <PassagePane passage={passage} controls={controls} />;
}
