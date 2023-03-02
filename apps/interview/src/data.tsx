import { Role, Beat, Tale } from "./types";
import { branch, introBeat } from "./actions";
import { tale, arc } from "./tale";

export const ROLES = [
  "principal",
  "sidekick",
  "team_player",
  "coder",
  "typescript_coder",
  "python_coder",
  "java_coder",
  "tester",
  "cicd",
  "github_user",
  "agile_user",
  "analyst",
  "teacher",
  "opensource",
  "graphics",
  "writer",
  "maker",
  "inventor",
  "strategist",
  "leader",
  "artist",
  "linguist",
  "sportsman",
] as const satisfies ReadonlyArray<string>;

const illuminationsIntro: Beat<any> = introBeat(
  arc(
    ["artist", "maker", "inventor"],
    <>
      When I was running my own small business in the digital arts sector, I had
      the chance to conceive and deliver my own solo and community-arts
      projects. A good example is the Morecambe Mini Illuminations. For that
      project I designed a new style of artwork that could be attempted by young
      families, and ran a series of funded workshops to build these
      Illuminations every winter season for three years before COVID.
    </>
  )
);

export const TALES = {
  illuminations: tale(
    [
      "artist",
      "coder",
      "teacher",
      "maker",
      "inventor",
      "leader",
      "python_coder",
    ] as const,
    branch({
      "Tell me about a project that you have led successfully.": arc(
        ["leader"] as const,
        illuminationsIntro,
        <>Describe how the Mini Illuminations involved leadership.</>
      ),
      "You style yourself as an inventor. What have you invented?": arc(
        ["inventor"] as const,
        illuminationsIntro,
        <>Describe how the Mini Illuminations involved inventing a new device</>
      ),
      "What do you like to do outside work?": arc(
        ["artist", "maker"],
        illuminationsIntro,
        <>
          Describe how Mini Illuminations is based on hobbies of doing art and
          making electronics
        </>
      ),
      "Your CV emphasises full-stack development in Typescript. Do you know any other languages?":
        arc(
          ["python_coder"],
          illuminationsIntro,
          <>Describe use of python in Mini Illuminations</>
        ),
    })
  ),
} satisfies Record<string, Tale<any>>;
