import { Beat, Role, Tale } from "./types";
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
    ["coder", "teacher"] as const,
    <>
      Running my small business in the digital arts sector, I conceived and
      delivered my own solo and community-arts projects. A good example is the
      Morecambe Mini Illuminations. For that project I designed a new style of
      programmable artwork that could be attempted by families, and ran a series
      of funded workshops to build these Illuminations every winter season for
      three years before COVID.
    </>
  )
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
      ["maker"],
      illuminationsIntro,
      <>
        Describe how Mini Illuminations is based on hobbies of doing art and
        making electronics
      </>
    ),
  })
);

const btIntro: Beat<any> = introBeat(arc([""] as const, <></>));
const bt = tale(
  ["analyst", "coder", "java_coder", "inventor", "strategist", "writer"],
  branch({})
);

const bbcIntro: Beat<any> = arc(["team_player", "typescript_coder"], <></>);

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
        ["python_coder", "java_coder"],
        bbcIntro,
        <>Describe use of python and java at BBC</>
      ),
    "Have you worked in an Agile Team? Did you use Scrum or Kanban?": arc(
      ["agile_user"],
      bbcIntro,
      <></>
    ),
    "What do you consider good practice in Automated Testing?": arc(
      ["tester", "cicd"],
      bbcIntro,
      <></>
    ),
  })
);

const snykIntro: Beat<any> = arc([""], <></>);

const snyk = tale(
  [
    "coder",
    "typescript_coder",
    "agile_user",
    "github_user",
    "principal",
    "cicd",
    "sidekick",
    "tester",
  ],
  branch({
    "How do you approach disciplining a product backlog?": arc(
      ["agile_user"],
      <></>
    ),
  })
);

const parkrunIntro: Beat<any> = introBeat(arc([] as const, <></>));
const parkrun = tale([], branch({}));

const paraglidingIntro: Beat<any> = introBeat(arc([] as const, <></>));
const paragliding = tale([], branch({}));

export const TALES = {
  illuminations,
  bbc,
  bt,
  snyk,
  paragliding,
  parkrun,
  lauf,
  shrimpingit,
  make_adafruit_vgkits,
  nottingham_philosophy,
  lancaster_design,
  sussex_ai,
} satisfies Record<string, Tale<any>>;
