# Watchword - Interactive fiction from JSX generators

Watchword explores Interactive Fiction authoring using Typescript generators to yield JSX text passages and controls.

The branching logic of generators/coroutines are a natural formalism for defining interactive fiction stories. Watchword introduces two innovations to prove the approach...

- An engine that reconciles `yield`-based branching with JSX rendering, eventing

  - generators yield PageMaker UI component factories, and halt waiting for a UI callback
  - the engine is grammar- and ui- agnostic, allowing any branching story or game to be presented

- An example terse grammar for authoring choice-based stories

  - `tell` passages with no choice (just a 'Next' control)
  - `prompt` passages with Choice-based controls

## Commentary on Implementation

A pattern emerging in the codebase is to use generators of structures which serve e.g. authoring, testing, but which are decorated to make them compatible with the core execution model - in which complex UI elements can be yielded.

For example, at a logical level, a generator may yield raw strings, JSX fragments, or tell and prompt data structures so that authors can easily compose the stories, and so that tests can be authored simply (without interacting with a headless browser).

However, this generator is then 'decorated' to yield JSX factories, which can be used directly with the execution engine.
