import { safeEntries } from "@watchword/core";

export function Ask<AskId extends string>(props: {
  passage: JSX.Element;
  questions: { [id in AskId]?: JSX.Element };
  handler: (id: AskId) => void;
}) {
  return (
    <>
      <p>{props.passage}</p>
      {safeEntries(props.questions).map(([askId, askPassage]) => {
        <button onClick={() => props.handler(askId)}>{askPassage}</button>;
      })}
    </>
  );
}
