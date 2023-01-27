import { Button } from "react-daisyui";
import { PassagePane } from "./PassagePane";

export function Tell(props: { passage: JSX.Element; nextPage: () => void }) {
  const { passage, nextPage } = props;

  const controls = (
    <div className="flex flex-col">
      <Button color="secondary" className="w-fit m-1" onClick={nextPage}>
        Next
      </Button>
    </div>
  );

  return <PassagePane passage={passage} controls={controls}></PassagePane>;
}
