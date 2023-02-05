import { MemberOf } from "@watchword/core";
import { taleCountsByRole } from "./logic";
import { Interview, InterviewEntry, Tale } from "./types";

/** List roles declared by a tale but not yet tagged by the tale. */
function listLocallyUntaggedRoles<T extends Tale<any, any>>(
  tale: T
): MemberOf<T["roles"]>[] {
  return tale.roles.filter((role) => !tale.state.tagged.includes(role));
}

/** Create a comparator for Tale priority order, given the current state of tales. */
export function createTaleComparator<I extends Interview<any>>(interview: I) {
  return ([, taleA]: InterviewEntry<I>, [, taleB]: InterviewEntry<I>) => {
    // least invoked tale
    const { invoked: invokeCountA } = taleA.state;
    const { invoked: invokeCountB } = taleB.state;
    if (invokeCountA !== invokeCountB) {
      return invokeCountA - invokeCountB;
    }

    // figure out roles not yet evidenced
    const untaggedA = listLocallyUntaggedRoles(taleA);
    const untaggedB = listLocallyUntaggedRoles(taleB);

    // tale with most roles still to be evidenced
    if (untaggedA.length !== untaggedB.length) {
      return untaggedB.length - untaggedA.length;
    }

    // tale with globally least evidenced role
    const tagCounts = taleCountsByRole(interview);
    const leastCountedA = Math.min(
      Number.MAX_SAFE_INTEGER,
      ...untaggedA.map((role) => tagCounts[role])
    );
    const leastCountedB = Math.min(
      Number.MAX_SAFE_INTEGER,
      ...untaggedB.map((role) => tagCounts[role])
    );
    if (leastCountedA !== leastCountedB) {
      return leastCountedB - leastCountedA;
    }

    // no ordering
    return 0;
  };
}
