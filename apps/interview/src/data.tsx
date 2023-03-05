import { branch, introArc, isTagged } from "./actions";
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

/** Define an introductory page which is only visited the first time, and evidences two roles. */
const illuminationsIntro = introArc(
  ["coder", "teacher"] as const,
  <>
    Running my small business in the digital arts sector, I conceived and
    delivered my own solo and community-arts projects. A good example is the
    Morecambe Mini Illuminations. For that project I designed a new style of
    programmable artwork that could be attempted by families, and ran a series
    of funded workshops to build these Illuminations every winter season for
    three years before COVID.
  </>
);

/** Create the illuminations tale, which has the intro embedded in it, as well as
 * branching logic and content guards based on what the user has already seen.
 */
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
      ["leader", "coder"] as const,
      illuminationsIntro,
      function* (store) {
        yield (
          <>
            Describe how the Mini Illuminations involved leadership
            {!isTagged(store, "coder")
              ? `and about coding which wasn't mentioned yet`
              : ``}
            .
          </>
        );
      }
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

const TALES = {
  illuminations,
} as const;

// experiment to see if Typescript can reason about exhaustiveness
// type ValidTale<T extends Tale<any, any>> = T extends Tale<infer R, infer Tagged>
//   ? R extends Tagged
//     ? true
//     : false
//   : false;
