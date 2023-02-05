import React from "react";
import { composeEntry, safeEntries } from "@watchword/core";
import { describe, test, expect, assert } from "vitest";
import {
  notifyEnteredTale,
  notifyExitedTale,
  tag,
  tale,
} from "../../src/beats/factories";
import { createInterviewModel } from "../../src/beats/interview";
import { createTaleComparator } from "../../src/beats/priority";
import { Interview, InterviewEntry } from "../../src/beats/types";
import { flushEvents, shuffle } from "../util";

function sort<I extends Interview<string>>(
  interview: I,
  entries: InterviewEntry<I>[],
  options: {
    shuffle: boolean;
  } = { shuffle: false }
) {
  const comparator = createTaleComparator(interview);

  const sorted = [...entries];
  if (options.shuffle) {
    shuffle(sorted);
  }
  sorted.sort((a, b) => {
    const order = comparator(a, b);
    return order;
  });

  return sorted;
}

function expectEqual<I extends Interview<string>>(
  interview: I,
  entryA: InterviewEntry<I>,
  entryB: InterviewEntry<I>
) {
  const comparator = createTaleComparator(interview);
  const comparison = comparator(entryA, entryB);
  expect(Math.sign(comparison)).toBe(0);
}

describe("Tale priority order", () => {
  function createExampleInterview() {
    return {
      space: tale(["astronaut"], function* () {
        yield <>I went to space</>;
      }),
      cake: tale(["baker"], function* () {
        yield <>I baked a cake</>;
      }),
    } as const;
  }

  describe("Comparator", () => {
    test("Default order is property declaration order", async () => {
      const interview = createExampleInterview();
      const entries = safeEntries(interview);

      // pluck test entries
      const [firstEntry, secondEntry] = entries;

      // neither entry has priority
      expectEqual(interview, firstEntry, secondEntry);

      // space was declared before cake
      const sortedEntries = sort(interview, entries);
      expect(sortedEntries).toMatchObject([firstEntry, secondEntry]);
    });

    test("Order firstly by invocation count", async () => {
      // create interview and launch interview store
      const interview = createExampleInterview();
      const { taleStoreCache } = createInterviewModel(interview);

      // visit the cake tale
      notifyEnteredTale(taleStoreCache["cake"]);
      notifyExitedTale(taleStoreCache["cake"]);
      await flushEvents();

      // list entries out-of-order
      const unsorted = safeEntries(interview);
      unsorted.reverse();

      // generate sorted list
      const sorted = sort(interview, unsorted);

      // pluck test entries
      const cakeEntry = sorted.find(([name]) => name === "cake");
      const spaceEntry = sorted.find(([name]) => name === "space");
      expect(cakeEntry).toBeTruthy();
      expect(spaceEntry).toBeTruthy();

      // sorted least visited first
      expect(sorted).toMatchObject([spaceEntry, cakeEntry]);
    });

    test("Order secondly by most untagged roles", async () => {
      const interview = {
        spaceCakes: tale(
          ["astronaut", "baker", "vlogger"],
          tag(
            ["astronaut", "baker", "vlogger"],
            <>I filmed myself making space cakes</>
          )
        ),
        teeth: tale(
          ["dentist", "underwater"],
          tag(["dentist", "underwater"], <>I pulled some teeth</>)
        ),
        spaceTeeth: tale(
          ["astronaut", "dentist"],
          tag(["astronaut", "dentist"], <>I pulled teeth in space</>)
        ),
      } as const;

      // artificially tag the dentist role in the teeth story
      const { taleStoreCache } = createInterviewModel(interview);
      // traverse the teeth tale (should tag with dentist)
      [...interview.teeth(taleStoreCache.teeth)];
      await flushEvents();

      const spaceCakeEntry = composeEntry(interview, "spaceCakes");
      const spaceTeethEntry = composeEntry(interview, "spaceTeeth");

      // test-run the sort
      const unsorted = [spaceCakeEntry, spaceTeethEntry];
      unsorted.reverse();
      const sorted = sort(interview, unsorted);

      expect(sorted).toMatchObject([spaceCakeEntry, spaceTeethEntry]);
    });
  });
});
