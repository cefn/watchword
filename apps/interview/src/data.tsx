import { branch, introArc } from "./actions";
import { arc, tale } from "./tale";

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

const illuminationsIntro = introArc(
  ["artist", "teacher", "coder"] as const,
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
    "Tell me about a project that you have led successfully.": arc(
      ["leader", "artist", "coder", "teacher"] as const,
      illuminationsIntro,
      <>Describe how the Mini Illuminations involved leadership</>
    ),
    "You style yourself as an inventor. What have you invented?": arc(
      ["inventor", "artist", "coder", "teacher"] as const,
      illuminationsIntro,
      <>Describe how the Mini Illuminations involved inventing a new device</>
    ),
    "What do you like to do outside work?": arc(
      ["maker", "artist", "coder", "teacher"],
      illuminationsIntro,
      <>
        Describe how Mini Illuminations is based on hobbies of doing art and
        making electronics
      </>
    ),
  })
);

const bbcIntro = introArc(["team_player", "typescript_coder"], <></>);

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
      arc(
        ["python_coder", "java_coder", "team_player", "typescript_coder"],
        bbcIntro,
        <>Describe use of python and java at BBC</>
      ),
    "Have you worked in an Agile Team? Did you use Scrum or Kanban?": arc(
      ["agile_user", "team_player", "typescript_coder"],
      bbcIntro,
      <></>
    ),
    "What do you consider good practice in Automated Testing?": arc(
      ["tester", "cicd", "team_player", "typescript_coder"],
      bbcIntro,
      <></>
    ),
  })
);

export const TALES = {
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
} as const;
