import { prompt, PageSequence } from "@watchword/ui-fiction";

export function* createPageSequence(): PageSequence {
  yield (
    <>
      <h1>Goodbye World</h1>
      <>By Cefn Hoile</>
    </>
  );
  yield (
    <>
      You wake bruised in a darkened, musty room with the freshness of the sound
      of running water
    </>
  );
  const choice = yield* prompt(
    <>
      You've no idea how you arrived here, but you are so groggy and exhausted
      you're not sure if you can even stand up.
    </>,
    {
      run: <>Run away</>,
      sleep: <>Go back to sleep</>,
    }
  );

  if (choice === "sleep") {
    yield (
      <>
        <h1>You win!</h1>
        <>
          You go back to sleep and die peacefully from Carbon Monoxide
          poisoning, thanks to a poorly maintained gas fire. Not a bad way to
          go.
        </>
      </>
    );
  } else if (choice === "run") {
    yield (
      <>
        <h1>You lose!</h1>
        <>
          You run away and die violently in an accident with agricultural
          machinery. What a horrible way to go.
        </>
      </>
    );
  } else {
    // should never be reached
    choice satisfies never;
  }

  return <>The End</>;
}
