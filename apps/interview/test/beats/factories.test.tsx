import React from "react";
import { describe, test, expect } from "vitest";
import { createStore } from "@lauf/store";
import type {
  Beat,
  StringTuple,
  TaggingBeat,
  Tale,
  TaleState,
} from "../../src/beats/types";
import { everyRoleTagged, tagRoles } from "../../src/beats/logic";
import {
  tale,
  tag,
  flag,
  flagOnce,
  tagOnce,
  branch,
  serveContent,
} from "../../src/beats/factories";
import { PageSequence, prompt, tell } from "@watchword/fiction-grammar";
import {
  EXAMPLE_STORED_ROLES,
  EXAMPLE_TAGGED_ROLES,
  createExampleTaleStore,
  flushEvents,
  StoredRole,
  TaggedRole,
} from "../util";
import { edit } from "@lauf/store-edit";

/** Can be awaited to allow store watchers to run (watching happens in next event loop) */
async function allowWatchTick() {
  return flushEvents();
}

describe("Content passthrough", () => {
  /** Reference content beat with read procedure (used to prove passthrough behaviours) */

  const referenceBeat: Beat<TaggedRole> = function* () {
    const choice = yield* prompt(<>Choose One</>, {
      a: <>Answer A</>,
      b: <>Answer B</>,
    });
    if (choice === "b") {
      yield* tell(<>Secret passage</>);
    }
    yield <>Three</>;
  };

  /** Procedure to interactively consume the reference beat (passing choices) */
  function readReferenceBeat(sequence: PageSequence<void>, exhaust = true) {
    const pages: unknown[] = [];
    pages.push(sequence.next().value);
    pages.push(sequence.next("b").value);
    pages.push(sequence.next().value);
    if (exhaust) {
      // consume sequence until it returns
      [...sequence];
    }
    return pages;
  }

  describe("Reference content behaviour", () => {
    test("Snapshot matches", async () => {
      const store = createExampleTaleStore();
      const sequence = referenceBeat(store);
      const pages = readReferenceBeat(sequence);
      expect(pages).toMatchInlineSnapshot(`
      [
        {
          "choices": {
            "a": <React.Fragment>
              Answer A
            </React.Fragment>,
            "b": <React.Fragment>
              Answer B
            </React.Fragment>,
          },
          "passage": <React.Fragment>
            Choose One
          </React.Fragment>,
        },
        {
          "passage": <React.Fragment>
            Secret passage
          </React.Fragment>,
        },
        <React.Fragment>
          Three
        </React.Fragment>,
      ]
    `);
    });
  });

  describe("tale() passthrough", () => {
    test("Single content beat", async () => {
      // read pages normally
      const pages = readReferenceBeat(referenceBeat(createExampleTaleStore()));

      // read pages when wrapped
      const taleBeat = tale(EXAMPLE_STORED_ROLES, referenceBeat);
      const talePages = readReferenceBeat(taleBeat(createExampleTaleStore()));

      expect(talePages).toMatchObject(pages);
    });

    test("Multiple content beats", async () => {
      // read pages normally
      const sourcePages = readReferenceBeat(
        referenceBeat(createExampleTaleStore())
      );

      // create a taleBeat that with three identical source beats
      const taleBeat = tale(
        EXAMPLE_STORED_ROLES,
        referenceBeat,
        referenceBeat,
        referenceBeat
      );

      // read tale beat three times sequentially
      const taleSequence = taleBeat(createExampleTaleStore());
      const talePages = [
        ...readReferenceBeat(taleSequence, false), // don't expect return
        ...readReferenceBeat(taleSequence, false), // don't expect return
        ...readReferenceBeat(taleSequence), // do expect return
      ];

      // page sequence should be the same
      expect(talePages).toMatchObject([
        ...sourcePages,
        ...sourcePages,
        ...sourcePages,
      ]);
    });
  });
});

describe("Beat factories", () => {
  describe("tale() factory", () => {
    /** Minimal state tracking implementation (mocks behaviour of interview). */
    function createTaleModel<
      Stored extends string,
      T extends Tale<Stored, Stored>
    >(tale: T) {
      // create store from tale.state, subscribe tale to store changes
      const store = createStore<TaleState<Stored>>(tale.state);
      store.watch((state) => (tale.state = state));

      // launch a page sequence from the tale, passing it the store
      const sequence = tale(store);

      return {
        tale,
        store,
        sequence,
      };
    }

    describe("PageSequence", () => {
      describe("State manipulation", () => {
        /** Simple linear tale */
        function createLinearTaleModel() {
          return createTaleModel(
            tale<StoredRole, TaggedRole>(
              EXAMPLE_STORED_ROLES,
              function* (store) {
                yield <>Went to space</>;
                tagRoles(store, "astronaut");
                yield <>Kneaded some dough</>;
                tagRoles(store, "baker");
                yield <>It was great</>;
              }
            )
          );
        }

        test("State initialised correctly", () => {
          const { tale } = createLinearTaleModel();
          expect(tale.state).toMatchObject({
            active: false,
            invoked: 0,
            flagged: [],
            tagged: [],
          });
        });

        test("Tale state active and invoked after first yield", async () => {
          const { sequence, tale } = createLinearTaleModel();
          sequence.next();
          await allowWatchTick();
          expect(tale.state).toMatchObject({
            active: true,
            invoked: 1,
            flagged: [],
            tagged: [],
          });
        });

        test("Tale state can tag roles during sequence", async () => {
          const { sequence, tale } = createLinearTaleModel();
          sequence.next();
          await allowWatchTick();
          expect(tale.state.tagged).toMatchObject([]);
          sequence.next(); // astronaut tagged here
          await allowWatchTick();
          expect(tale.state.tagged).toMatchObject(["astronaut"]);
          sequence.next(); // baker tagged here
          await allowWatchTick();
          expect(tale.state.tagged).toMatchObject(["astronaut", "baker"]);
        });

        test("Tale sequence yields pages", async () => {
          const { sequence } = createLinearTaleModel();
          const pages: unknown[] = [...sequence];
          expect(pages).toMatchInlineSnapshot(`
            [
              <React.Fragment>
                Went to space
              </React.Fragment>,
              <React.Fragment>
                Kneaded some dough
              </React.Fragment>,
              <React.Fragment>
                It was great
              </React.Fragment>,
            ]
          `);
        });

        test("Tale state not active after returning", async () => {
          const { sequence, tale } = createLinearTaleModel();
          // execute sequence
          [...sequence];
          await allowWatchTick();
          expect(tale.state).toMatchObject({
            active: false,
            invoked: 1,
            flagged: [],
            tagged: ["astronaut", "baker"],
          });
        });
      });
    });
  });

  describe("tag() factory", () => {
    describe("autotags roles", () => {
      test("no roles autotagged during beat", async () => {
        const tagBeat = tag(EXAMPLE_TAGGED_ROLES, function* (store) {
          yield <>Roses are red</>;
          yield <>Violets are blue</>;
        });
        const store = createExampleTaleStore();
        const sequence = tagBeat(store);
        expect(store.read().tagged).toMatchObject([]);
        sequence.next();
        sequence.next();
        // halt before finish
        expect(store.read().tagged).toMatchObject([]);
      });

      test("roles autotagged at end of beat", async () => {
        const tagBeat = tag(EXAMPLE_TAGGED_ROLES, function* (store) {
          yield <>Roses are red</>;
          yield <>Violets are blue</>;
        });
        const store = createExampleTaleStore();
        [...tagBeat(store)];
        expect(store.read().tagged).toMatchObject([
          "astronaut",
          "baker",
          "cook",
        ]);
      });
    });
  });

  describe("flag() factory", () => {
    describe("Autoflags symbols", () => {
      test("Before beat", async () => {
        const store = createExampleTaleStore();
        const flagBeat = flag<TaggedRole>(function* (store) {
          yield <>Sugar is sweet</>;
          yield <>So are you</>;
        });
        const { flagged } = flagBeat;
        const sequence = flagBeat(store);

        // no flags when created
        const beforeFirst = store.read();
        expect(beforeFirst.flagged).toMatchObject([]);

        // flagged immediately on first yield
        sequence.next();
        const afterFirst = store.read();
        expect(afterFirst.flagged).toMatchObject([flagged]);

        // exhaust sequence, expect no further flagging
        [...sequence];
        const afterLast = store.read();
        expect(afterLast.flagged).toMatchObject(afterFirst.flagged);
      });
    });
  });

  describe("flagOnce() factory", () => {
    describe("Symbol assignment", () => {
      test("flagged symbol can be passed as arg", async () => {
        const arg = Symbol();
        const { flagged } = flagOnce<TaggedRole>(function* () {}, arg);
        expect(flagged).toBe(arg);
      });

      test("flagged symbol gets unique value if omitted", async () => {
        const { flagged } = flagOnce<TaggedRole>(function* () {});
        expect(typeof flagged).toBe("symbol");
      });
    });

    describe("Beat execution", () => {
      test("flagOnce sets flag if unset", async () => {
        const flagOnceBeat = flagOnce<TaggedRole>(function* () {
          yield <>Hello World</>;
        });
        const { flagged } = flagOnceBeat;

        const store = createExampleTaleStore();

        // flagged is unset
        expect(store.read().flagged).toMatchObject([]);
        // one page yielded
        expect([...flagOnceBeat(store)].length).toBe(1);
        // now flagged is set
        expect(store.read().flagged).toMatchObject([flagged]);
        // zero pages yielded
        expect([...flagOnceBeat(store)].length).toBe(0);
        // flagged is still set
        expect(store.read().flagged).toMatchObject([flagged]);
      });

      test("flagOnce never yields if flag already set in TaleStore", async () => {
        const flagOnceBeat = flagOnce<TaggedRole>(function* () {
          yield <>Hello World</>;
        });
        const { flagged } = flagOnceBeat;

        // create store and set flag
        const store = createExampleTaleStore();
        edit(store, (draft) => draft.flagged.push(flagged));

        // flagged already set
        expect(store.read().flagged).toMatchObject([flagged]);
        // zero pages yielded
        expect([...flagOnceBeat(store)].length).toBe(0);
        // flagged is still set
        expect(store.read().flagged).toMatchObject([flagged]);
      });

      test("flagOnce yields once if flag not yet set in TaleStore", async () => {
        let callCount = 0;
        const flagOnceBeat = flagOnce<TaggedRole>(function* () {
          callCount++;
          yield <>Never Repeated</>;
        });

        const store = createExampleTaleStore();

        const firstSequence = flagOnceBeat(store);
        expect(callCount).toBe(0);
        expect([...firstSequence].length).toBe(1);
        expect(callCount).toBe(1);

        const secondSequence = flagOnceBeat(store);
        expect([...secondSequence].length).toBe(0);
        expect(callCount).toBe(1);
      });

      test("flagOnce() beat yields once when referenced in multiple beats", async () => {
        let callCount = 0;
        const flagOnceBeat = flagOnce<TaggedRole>(function* () {
          callCount++;
          yield <>Never Repeated</>;
        });

        const beatA: Beat<TaggedRole> = function* (store) {
          yield* flagOnceBeat(store);
          yield <>End A</>;
        };
        const beatB: Beat<TaggedRole> = function* (store) {
          yield* flagOnceBeat(store);
          yield <>End B</>;
        };
        const beatCombined: Beat<TaggedRole> = function* (store) {
          yield* beatA(store);
          yield* beatB(store);
        };

        const store = createExampleTaleStore();
        expect([...beatCombined(store)]).toMatchInlineSnapshot(`
          [
            <React.Fragment>
              Never Repeated
            </React.Fragment>,
            <React.Fragment>
              End A
            </React.Fragment>,
            <React.Fragment>
              End B
            </React.Fragment>,
          ]
        `);
      });
    });
  });

  describe("tagOnce() factory", () => {
    describe("Beat execution", () => {
      test("tags roles on return", async () => {
        // tagOnce counts calls
        let callCount = 0;
        const tagOnceBeat = tagOnce(["astronaut"], function* () {
          callCount++;
          yield <>Once upon a time</>;
        });

        // beat invokes it twice
        const referringBeat: Beat<TaggedRole> = function* (store) {
          yield* tagOnceBeat(store);
          yield* tagOnceBeat(store);
        };

        // run the beat
        const store = createExampleTaleStore();
        const pages = [...referringBeat(store)];

        // tagOnce should only have been called once
        expect(pages.length).toBe(1);
        expect(callCount).toBe(1);
      });

      test("tags roles on return", async () => {
        const tagOnceBeat = tagOnce(["astronaut"], function* () {
          yield <>Once upon a time</>;
        });
        // initialise the sequence against a store
        const store = createExampleTaleStore();
        const tagSequence = tagOnceBeat(store);
        expect(store.read().tagged).toMatchObject([]);

        // trigger a yield
        tagSequence.next();
        expect(store.read().tagged).toMatchObject([]);

        // run the sequence until it returns
        [...tagSequence];

        //tag has been set
        expect(store.read().tagged).toMatchObject(["astronaut"]);
      });
    });
  });

  describe("branch() factory", () => {
    describe("Beat execution", () => {
      function createBranchBeat() {
        const taggedAstronaut: TaggingBeat<"astronaut"> = tag(
          ["astronaut"],
          function* () {
            yield <>I went to space</>;
          }
        );
        const taggedBaker: TaggingBeat<"baker"> = tag(["baker"], function* () {
          yield <>I kneaded some dough</>;
        });
        return branch({
          "Were you an astronaut?": taggedAstronaut,
          "Did you bake cakes?": taggedBaker,
        });
      }

      test("Yields to chosen branch", async () => {
        const branchBeat = createBranchBeat();
        // interact with story
        const branchSequence = branchBeat(createExampleTaleStore());
        branchSequence.next(); // step to prompt
        const { value } = branchSequence.next("Did you bake cakes?"); // make choice
        [...branchSequence]; // consume remaining sequence

        // should choose baker branch
        expect(value).toMatchInlineSnapshot(`
          <React.Fragment>
            I kneaded some dough
          </React.Fragment>
        `);
      });

      test("Eliminates exhausted branches", async () => {
        const branchBeat = createBranchBeat();

        // create store with baker role already visited
        const store = createExampleTaleStore();
        edit(store, (draft) => draft.tagged.push("baker"));

        // interact with story
        const branchSequence = branchBeat(store);
        const { value } = branchSequence.next(); // step to prompt
        branchSequence.next("Did you bake cakes?"); // make choice
        [...branchSequence]; // consume remaining sequence

        // should only prompt astronaut choice
        expect(value).toMatchInlineSnapshot(`
          {
            "choices": {
              "Were you an astronaut?": <React.Fragment>
                Were you an astronaut?
              </React.Fragment>,
            },
            "passage": <React.Fragment>
              Choose a question
            </React.Fragment>,
          }
        `);
      });

      test("Returns immediately if all branches exhausted", async () => {
        const branchBeat = createBranchBeat();
        // create store with baker and astronaut roles already visited
        const store = createExampleTaleStore();
        edit(store, (draft) => draft.tagged.push("astronaut"));
        edit(store, (draft) => draft.tagged.push("baker"));

        // interact with story
        const branchSequence = branchBeat(store);
        const { done } = branchSequence.next();
        expect(done).toBe(true);
      });
    });
  });

  describe("serveContent()", () => {
    test("Can serve either beats or fragments", () => {
      const store = createExampleTaleStore();
      const fragment = <>A is for apple</>;
      const beat: Beat<TaggedRole> = function* () {
        yield <>B is for ball</>;
      };
      const servingBeat: Beat<TaggedRole> = function* (store) {
        yield* serveContent(store, beat, fragment);
      };
      // read the served pages
      const pages = [...servingBeat(store)];

      // both beats should be served
      // expect(pages.length).toBe(2);
      expect(pages).toMatchInlineSnapshot(`
        [
          <React.Fragment>
            B is for ball
          </React.Fragment>,
          <React.Fragment>
            A is for apple
          </React.Fragment>,
        ]
      `);
    });

    test("Yields from every beat passed to it", () => {
      // create two beats
      const beatA: Beat<TaggedRole> = function* () {
        yield <>A is for apple</>;
      };
      const beatB: Beat<TaggedRole> = function* () {
        yield <>B is for ball</>;
      };
      // serve them
      const servingBeat: Beat<TaggedRole> = function* (store) {
        yield* serveContent(store, beatA, beatB);
      };

      // read the served pages
      const store = createExampleTaleStore();
      const pages = [...servingBeat(store)];

      // both beats should be served
      expect(pages.length).toBe(2);
      expect(pages).toMatchInlineSnapshot(`
        [
          <React.Fragment>
            A is for apple
          </React.Fragment>,
          <React.Fragment>
            B is for ball
          </React.Fragment>,
        ]
      `);
    });
  });

  test("Coverage of empty role list, (though StringTuple type prevents it)", () => {
    const store = createExampleTaleStore();
    const roles = [] as unknown as StringTuple<TaggedRole>;
    expect(everyRoleTagged(store.read(), roles)).toBe(true);
  });
});
