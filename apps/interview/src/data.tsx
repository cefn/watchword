import { Role, Beat, Tale, Content, ContentTuple } from "./types";
import { branch, taleVisited } from "./actions";
import { tale, arc, serveContent } from "./tale";
import { NoInfer } from "@watchword/core";

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

function introBeat<Evidenced extends Role>(
  ...contents: ContentTuple<Evidenced>
): Beat<Evidenced> {
  return function* (store) {
    if (!taleVisited(store)) {
      yield* serveContent(store, ...contents);
    }
  };
}

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
        <></>
      ),
    })
  ),
} satisfies Record<string, Tale<any>>;
