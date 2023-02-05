import { ElementFactory, ElementSequence } from "@watchword/core";

const ROLES = [
  "principal",
  "sidekick",
  "typescript",
  "programmer",
  "tester",
  "cicd_plumber",
  "agile_user",
  "maker",
  "inventor",
  "analyst",
  "strategist",
  "organiser",
  "artist",
  "linguist",
  "team_player",
  "sports",
] as const satisfies ReadonlyArray<string>;
type Role = (typeof ROLES)[number];

type TaleSequence<Return, Next = Return> = Generator<
  ElementFactory<Next>,
  Return,
  Next
>;

/** Sequence factory for a question having choices, which redirects the interview. */
type BranchCall<Choice extends string> = (
  passage: JSX.Element,
  questions: {
    [k in Choice]?: JSX.Element;
  }
) => ElementSequence;

/** Interview action without choices. It's another chapter of an ongoing answer
 * that has more content, demonstrates more roles. It therefore nexts and returns
 * nothing as there are no branch points.
 */
type MoreCall = (
  question: JSX.Element,
  passage: JSX.Element,
  ...roles: [Role, ...Role[]]
) => TaleSequence<void>;

export interface PromptAction<Choice extends string> {
  passage: JSX.Element;
  choices: {
    [k in Choice]?: JSX.Element;
  };
}
