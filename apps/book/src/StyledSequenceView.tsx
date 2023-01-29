import { ElementSequenceView } from "@watchword/core-react";

/** Mirror the props of StoryView. */
type StoryViewProps = Parameters<typeof ElementSequenceView>[0];

/** Adds the tailwind CSS to the page payload. */
import "@watchword/ui-fiction/css";

/** Component just passes through to StoryView, but the import above ensures
 * styles are bundled. */
export function StyledSequenceView(props: StoryViewProps) {
  return <ElementSequenceView {...props} />;
}
