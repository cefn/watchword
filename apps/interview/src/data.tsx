import { Tale } from "./types";
import { branch, skipBeat, taleVisited } from "./actions";
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

const illuminationsIntro = arc(
  ["artist", "maker"] as const,
  skipBeat(taleVisited, function* (store) {
    yield <></>;
  })
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
        function* (store) {}
      ),
    })
  ),
} satisfies Record<string, Tale<any>>;
