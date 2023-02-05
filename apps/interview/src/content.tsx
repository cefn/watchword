import type { Interview } from "./beats/types";
import type {
  InferTaleStored,
  InferTaleTagged,
  UntaggedPerTale,
} from "./beats/coverage";
import type { MemberOf, ValueOf } from "@watchword/core";
import { tale, tag, tagOnce, branch } from "./beats/factories";

type InterviewTale = ValueOf<typeof INTERVIEW>;

/** Roles not declared by any tale. */
type ForgottenRoles = Exclude<Role, DeclaredRoles>;
/** Roles declared by some tale. */
type DeclaredRoles = InferTaleStored<InterviewTale>;
/** Roles declared but not tagged by each tale. */
type UntaggedRoles = UntaggedPerTale<typeof INTERVIEW>;

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
  "open_source",
  "graphics",
  "writer",
  "maker",
  "inventor",
  "strategist",
  "leader",
  "artist",
  "linguist",
  "sportsman",
  "machine_learning",
] as const satisfies ReadonlyArray<string>;
export type Role = MemberOf<typeof ROLES>;

// vector graphics missing writer

const illuminationsIntro = tagOnce(
  ["artist", "teacher", "coder", "python_coder"] as const,
  <>
    Running my small business in the digital arts sector, I conceived and
    delivered my own solo and community-arts projects. A good example is the
    Morecambe Mini Illuminations. For that project I designed a new style of
    programmable artwork that could be attempted by families, and ran a series
    of funded workshops to build these Illuminations every winter season for
    three years until COVID.
  </>
);

const illuminations = tale(
  [
    "coder",
    "teacher",
    "artist",
    "maker",
    "inventor",
    "leader",
    "python_coder",
  ] as const,
  branch({
    "Tell me about a project that you have led successfully.": tag(
      ["leader", "artist", "coder", "teacher", "python_coder"] as const,
      illuminationsIntro,
      <>Describes how the Mini Illuminations involved leadership</>
    ),
    "You style yourself as an inventor. What have you invented?": tag(
      ["inventor", "artist", "coder", "teacher", "python_coder"] as const,
      illuminationsIntro,
      <>Describes how the Mini Illuminations involved inventing a new device</>
    ),
    "What do you like to do outside work?": tag(
      ["maker", "artist", "coder", "teacher", "python_coder"],
      illuminationsIntro,
      <>
        Describes how Mini Illuminations is based on hobbies of doing art and
        making electronics
      </>
    ),
  })
);

const bbcIntro = tagOnce(["team_player", "typescript_coder"], <></>);

const bbc = tale(
  [
    "analyst",
    "agile_user",
    "github_user",
    "cicd",
    "java_coder",
    "python_coder",
    "strategist",
    "team_player",
    "tester",
    "typescript_coder",
  ] as const,
  branch({
    "Your CV emphasises full-stack development in Typescript. Do you know any other languages?":
      tag(
        ["python_coder", "java_coder", "team_player", "typescript_coder"],
        bbcIntro,
        <>Describes use of python and java at BBC</>
      ),
    "Have you worked in an Agile Team? Did you use Scrum or Kanban?": tag(
      ["agile_user", "team_player", "typescript_coder"],
      bbcIntro,
      <>Describes experience of Agile ways of working</>
    ),
    "What do you consider good practice in Automated Testing?": tag(
      ["tester", "cicd", "team_player", "typescript_coder"],
      bbcIntro,
      <>Describes philosophy of testing</>
    ),
  })
);

export const INTERVIEW = {
  illuminations,
  bbc,
  // bt,
  // snyk,
  // paragliding,
  // parkrun,
  // lauf,
  // shrimpingit,
  // make_adafruit_vgkits,
  // nottingham_philosophy,
  // lancaster_design,
  // sussex_ai,
} as const satisfies Interview<Role>;
