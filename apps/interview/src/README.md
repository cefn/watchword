The interview structure is based on the following design principles;

## API and Content Design

The interview is implemented using the PageSequence API from the watchword interactive fiction engine and is composed of Tales.

Tales are generators yielding a sequence of content elements (text, fragments or arbitrary JSX components) describing a single activity from my career history. A Tale is a named property of the TALES lookup. Branching between different paths of yielded content is defined by procedural logic which reads linearly, with the procedure 'paused' at points that yield content.

Each Tale is provided with its own Store for state, recording for example if the Tale has been invoked, what Roles it contains evidence for, and whether those Roles have been evidenced yet.

Tale state assists with conditionally authoring content (e.g. second visits to the same Tale do not repeat themselves and Roles already evidenced can be skipped in passages). Stores are Immutable by design, so previously yielded JSX components can directly reference the state read within its closure when it was yielded, without those values changing later.

The content follows guidance for the design of interactive fiction. Choices are seen to matter (by noticeably varying content according to your choices) but actual branching is minimised (to prevent a combinatorial explosion).

## The Tale Loop

An outer PageSequence loop selects some Tale from the TALES lookup which is not yet considered 'exhausted', then yields to that Tale.

When a response passage evidences a particular Role, a call to `evidence` notifies this. Tales which are 'exhausted' are those whose Roles have ALL been evidenced, and are therefore no longer candidates for selection by the outer PageSequence logic. When every Tale is exhausted, the interview ends.

## Tale Selection

Tales have prioritisation as follows...

- A Tale evidencing a Role not visited
- A Tale not yet visited.

## Tale Structure

Tales could in principle have any structure, but currently each tale begins with branching questions. Choosing a question leads to a passage evidencing certain Roles in response.

Questions whose Roles have already been visited (e.g. by those questions being asked already) have their question removed from the list prompted to the user (and indirectly that branch is removed from the flow of the Tale). Branch points having all but 1 question omitted don't need to prompt the user, but can generate the content directly. Branch points where all questions are omitted can be ignored without yielding.

Typically a Tale has a preamble which is shown only once (detail when the Tale is first encountered). Later transits through the same Tale have a different preamble taking account that the Tale was already referenced.
