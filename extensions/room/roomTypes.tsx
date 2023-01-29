import { ActionSequence, Passage } from "../../types";
import { END } from "./roomStory";

/** An options object to combine WorldState definition and RoomId lookup - enough
 * to execute a roomStory */
export type RoomStoryOptions<
  RoomId extends string,
  WorldState extends RoomWorldState<RoomId>
> = {
  worldState: WorldState;
  rooms: RoomLookup<RoomId, WorldState>;
};

/** World state having at least a current room and titles for each room. Room
 * based stories should extend this */
export type RoomWorldState<RoomId extends string> = {
  currentRoomId: RoomId;
  roomTitles: { [id in RoomId]: Passage };
};

/** A lookup for rooms -  ActionSequences named by ids, whose sequences result
 * in the next RoomId or END. */
export type RoomLookup<
  RoomId extends string,
  WorldState extends RoomWorldState<RoomId>
> = {
  [id in RoomId]: (state: WorldState) => ActionSequence<RoomId | typeof END>;
};
