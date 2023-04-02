The interview structure is based on the following design principles;

## API and Content Design

The content follows guidance for the design of interactive fiction. Choices visibly matter (content is affected by your choices) but actual branching is minimised (to prevent a combinatorial explosion). It is essentially a set of chapters you can read in any order, and which you will probably read all of eventually, but which introduce 'color' since your choices have create a distinctive path through those chapters.

The interview is implemented using the PageSequence API from the watchword interactive fiction engine and is composed of Tales.

Tales are generators yielding a sequence of content elements (text, fragments or arbitrary JSX components) describing a single activity from my career history. A Tale is a named property of the TALES lookup. Branching between different paths of yielded content is defined by procedural logic which reads linearly. The generator paradigm means the interview procedure is 'paused' at the points that yield content.

Each Tale is provided with its own Store for state, recording for example if the Tale has been invoked, what Roles it contains evidence for, and whether those Roles have been evidenced yet.

Tale state drives conditional content reflecting the user's past choices in the interactive interview. For example, second visits to the same Tale do not repeat themselves and Roles already evidenced can be skipped in passages). Stores are Immutable by design, so previously yielded JSX components continue to read the state from when they were originally yielded, without those values changing later.

## The Tale Loop

An outer PageSequence selects some Tale from the TALES lookup which is not yet considered 'exhausted', then yields to that Tale, and this repeats in a loop. When a response passage evidences a particular `Role`, a call to `evidence` notifies this. `Tales` or `TaggingBeats` which are 'exhausted' are those whose `Roles` have ALL been evidenced. These are no longer candidates for selection. When all are exhausted the interview ends.

Every `Tale` and every `TaggingBeat` should comprehensively covers its roles, and logic will therefore hide it in any future iteration of the loop if it's exhausted. `Tales` are hidden by the logic of the interview loop, and `TaggingBeats` are hidden by the logic of the `branch` sequence.

In practice each Tale relates to a single item of career history, but there is normally a top-level `branch` sequence, in which different questions lead to different `TaggingBeats` having different roles. TaggingBeats which are exhausted are hidden - the interviewer is not offered that question.

## Typing the Authoring API

The authoring API makes heavy use of Typescript inference. The atom of content is a `Beat<Tagged extends Role>` that accepts a matching store (having `Tagged` among its roles). A `Beat` returns a `PageSequence` generator yielding pages of content and choices. As the generator runs it calls `tag(store,role)` to notify that a `Tagged` role was evidenced in a yielded passage.

A `TaggingBeat<Tagged extends Role>` is a `Beat<Tagged>` but includes a runtime list of Roles that's accessible to logic. Having a list allows a `TaggingBeat` to tag the roles at the end of its execution and to be skipped if its `Tagged` roles are already evidenced.

Finally a `Tale<Stored extends Role, Tagged extends Stored>` is an ancestor `Beat` with a store property and therefore a flag for each `Role`. To generate its `PageSequence` it delegates to `Beats`, `TaggingBeats` and `FlaggingBeats` which will manipulate the `TaleStore` as they serve content.

Type-safety should ensure that a `Beat` can only be passed to a `tale()` or `tag()` factory if its Roles are a subset of those declared in the `Tale` or `TaggingBeat`.

Testing is needed to validate all paths, although Typescript inference can reason about exhaustiveness of `Role` coverage. The `Stored` type and the `Tagged` type are distinct. Typescript can check that `Stored` extends `Tagged` to guarantee complete coverage (extended means it's a subset, including the case where it is equal).

## Tale Selection

Tales have prioritisation as follows...

- Tales not yet visited.
- Tales with the most untagged roles
- Tales evidencing the least-visited Role

## Tale Structure

Tales could in principle have any structure, but currently each tale begins with branching questions. Choosing a question leads to a passage evidencing certain Roles in response.

Questions whose Roles have already been visited (e.g. by those questions being asked already) have their question removed from the list prompted to the user (and indirectly that branch is removed from the flow of the Tale). Branch points having all but 1 question omitted don't need to prompt the user, but can generate the content directly. Branch points where all questions are omitted can be ignored without yielding.

Typically a Tale has a preamble which is shown only once (detail when the Tale is first encountered). Later transits through the same Tale have a different preamble taking account that the Tale was already referenced.
