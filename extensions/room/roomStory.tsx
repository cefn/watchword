import type { ActionSequence, Id } from "../../types";
import { prefixPassages } from "../splice";
import { RoomStoryOptions, RoomWorldState } from "./roomTypes";

/** Utility to create a navigable ActionSequence structured around multiple
 * rooms in a world with global state.
 */

/** A value returned to indicate the end of the story */
export const END = Symbol();

/** ActionSequence delegating story sequences to rooms */
export function* roomStory<
  RoomId extends Id,
  WorldState extends RoomWorldState<RoomId>
>(options: RoomStoryOptions<RoomId, WorldState>): ActionSequence<void> {
  const { rooms, worldState } = options;

  let room = rooms[worldState.currentRoomId];

  for (;;) {
    // work out room title
    const { currentRoomId, roomTitles } = worldState;
    const currentTitle = roomTitles[currentRoomId];

    // launch action sequence in this room
    const roomSequence = room(worldState);

    // create decorated sequence that intercepts actions, prefixing with room title
    const prefixedRoomSequence = prefixPassages(
      roomSequence,
      <h3>{currentTitle}</h3>
    );

    // iterate over sequence actions until destination returned
    const roomIdOrEnd = yield* prefixedRoomSequence;

    // check if story is complete
    if (roomIdOrEnd === END) {
      return;
    }

    // not complete - prepare for next room sequence
    room = rooms[roomIdOrEnd];
    worldState.currentRoomId = roomIdOrEnd;
  }
}
