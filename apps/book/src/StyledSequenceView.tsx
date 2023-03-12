import {
  ElementSequenceView,
  ElementSequenceViewProps,
} from "@watchword/core-react";

/** Adds the tailwind CSS to the page payload. */
import "@watchword/fiction-ui-react/css";

/** Component just passes through to StoryView, but the import above ensures
 * styles are bundled. */
export function StyledSequenceView(props: ElementSequenceViewProps) {
  return <ElementSequenceView {...props} />;
}
