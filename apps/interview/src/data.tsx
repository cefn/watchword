import { tag, taleVisited } from "./actions";
import { arc, tale } from "./tale";
import {
  Arc,
  Beat,
  ContentTuple,
  Role,
  RoleTuple,
  Tale,
  TaleStore,
} from "./types";

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

export function introArc<Tagged extends Role>(
  roles: RoleTuple<Tagged>,
  ...contents: ContentTuple<Tagged>
): Arc<Tagged> {
  const beat: Beat<Tagged> = function* (store) {
    // create arc, yield to it, if first visit
    if (taleVisited(store)) {
      // rely on arc beat logic to notify roles
      const arcBeat = arc(roles, ...contents);
      yield* arcBeat(store);
    }
  };
  return Object.assign({
    beat,
    roles,
  });
}

// const illuminationsIntro = introArc(["coder", "teacher"] as const, <></>);

const illuminationsBranches = arc(["artist"] as const, function* (store) {
  tag(store, "artist");
});

const beat = function* <Stored extends Role>(store: TaleStore<Stored>) {
  tag(store, "cicd");
};

const illuminations = tale(
  [
    "coder",
    // "teacher",
    // "artist",
    // "maker",
    // "inventor",
    // "leader",
    // "python_coder",
  ] as const,
  // arc(["agile_user"], function* () {}),
  // illuminationsIntro,
  illuminationsBranches
);

const TALES = {
  illuminations,
} as const;

type ValidTale<T extends Tale<any, any>> = T extends Tale<infer R, infer Tagged>
  ? R extends Tagged
    ? true
    : false
  : false;
