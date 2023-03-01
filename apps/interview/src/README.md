The interview structure is based on the following design principles;

## API and Content Design

The interview is implemented using the PageSequence API from the watchword interactive fiction engine.

Tales are generators yielding a sequence of content elements (text, fragments or arbitrary React components). Branching between different paths of yielded content is defined by procedural logic which reads linearly, with the procedure paused at points that yield content.

Each Tale covers a single activity from career history. A Tale is a named property in the TALES lookup and is a factory for a PageSequence. Each Tale is provided with its own store for state, recording for example if the Tale has been invoked, what Roles it evidences, and whether it has evidenced those Roles yet. This assists with conditionally authoring content (e.g. second visits to the same tale do not repeat themselves, Roles already evidenced can be skipped in passages).

The content follows guidance for the design of interactive fiction. Choices are seen to matter (by varying content according to your choices) but actual branching is minimised (to prevent a combinatorial explosion).

## The Tale Loop

An outer PageSequence loop selects some Tale from the TALES lookup which is not yet considered 'exhausted', then yields to that Tale.

When a response passage evidences a particular Role, a call to `evidence` notifies this. Tales which are 'exhausted' are those whose Roles have ALL been evidenced, and are therefore no longer candidates for selection by the outer PageSequence logic. When every Tale is exhausted, the interview ends.

## Tale Selection

Tales have prioritisation as follows...

- A Tale evidencing a Role not visited
- A Tale not yet visited.

## Tale Structure

Tales could in principle have any structure, but the current convention is to begin each tale with branching questions. Choosing a question leads to a passage evidencing certain Roles. Questions whose Roles have already been visited (e.g. by those questions being asked already) are later hidden.

Typically a Tale has a preamble which is shown only once (detail when the Tale is first encountered). Later transits through the same Tale have a different preamble taking account that the Tale was already referenced.
