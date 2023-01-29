# Watchword - Interactive fiction from JSX generators

The branching logic of generators/coroutines are a natural formalism for defining interactive fiction stories. This project explores Interactive Fiction authoring using Typescript generators to yield JSX text passages and controls.

## Features

Watchword prototypes two innovations to prove the approach...

- An engine that reconciles `yield`-based branching with JSX rendering and eventing

  - generators yield UI component factories
  - generators proceed to create and render the next component once the last component triggers a UI callback
  - The approach is grammar- and ui- agnostic, suitable for any branching story or game

- An example grammar and ui for authoring choice-based stories

  - generates a declarative grammar in turn decorated to generate component factories
  - `tell` passages offer no branches. They map to a simple 'Next' control
  - `prompt` passages offer alternate branches. They map to Choice-based controls

## Mapped Generators

A pattern emerging in the codebase is to have generators yielding story logic for e.g. authoring, testing, then map this generator to comply with the core execution model - yielding factories for complex UI elements.

A story logic grammar yields raw strings, JSX fragments, or tell and prompt data structures. This means authors can easily compose the stories without seeing the cruft of arrow functions, and facilitates testing against these declarative structures (without needing to interact with a headless browser).

However, this generator is then 'decorated' to yield JSX factories, which can be used directly with the execution engine.
