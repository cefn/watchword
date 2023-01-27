import { Button } from "react-daisyui";
import { PassagePane } from "./PassagePane";

export function Tell(props: { page: JSX.Element; nextPage: () => void }) {
  const { page, nextPage } = props;

  const controls = (
    <div className="flex flex-col">
      <Button color="secondary" className="w-fit m-1" onClick={nextPage}>
        Next
      </Button>
    </div>
  );

  return <PassagePane passage={page} controls={controls}></PassagePane>;
}
