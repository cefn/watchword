import { ReactNode } from "react";

export function PassagePane(props: {
  passage: ReactNode;
  controls: ReactNode;
}) {
  return (
    <div className="flex flex-row h-full">
      <article className="prose text-2xl w-3/4 bg-base-300 p-3 h-full">
        <h1>The Book</h1>
        {props.passage}
      </article>
      <div className="w-1/4">{props.controls}</div>
    </div>
  );
}
