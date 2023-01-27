export function PassagePane(props: {
  passage: JSX.Element;
  controls: JSX.Element;
}) {
  return (
    <div className="flex flex-row h-full">
      <article className="prose text-2xl w-3/4 bg-base-300 p-3 h-full">
        {props.passage}
      </article>
      <div className="w-1/4">{props.controls}</div>
    </div>
  );
}
