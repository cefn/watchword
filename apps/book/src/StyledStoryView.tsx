import { StoryView } from "@watchword/frontend";

/** Mirror the props of StoryView. */
type StoryViewProps = Parameters<typeof StoryView>[0];

/** Adds the tailwind CSS to the page payload. */
import "@watchword/frontend/css";

/** Component just passes through to StoryView, but the import above ensures
 * styles are bundled. */
export function StyledStoryView(props: StoryViewProps) {
  return <StoryView {...props} />;
}
