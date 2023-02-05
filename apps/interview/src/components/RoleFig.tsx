import { capitalize, initLookup, MemberOf } from "@watchword/core";
import { ROLES } from "../content";

const hashCode = (s: string) =>
  s.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

type FigureId = MemberOf<typeof FIGURE_IDS>;
type FigStyle = "outline+figure" | "outline" | "figure";
type FigImagePath = `../vector/grids/${FigStyle}/named/${FigureId}.png`;

export const FIGURE_IDS = [...ROLES, "cefn"] as const;
export const FIGURE_CODES = initLookup(
  (id) => Math.abs(hashCode(id) % 1000000), // a ~6 figure number
  ...FIGURE_IDS
);
export const FIG_IMAGE_URLS = import.meta.glob(
  `../vector/grids/{outline+figure,figure,outline}/named/*.png`,
  {
    eager: true,
    as: "url",
  }
) as Partial<Record<FigImagePath, string>>;

function getFigImageUrl(id: FigureId, style: FigStyle) {
  const loadedPath: FigImagePath = `../vector/grids/${style}/named/${id}.png`;
  return FIG_IMAGE_URLS[loadedPath];
}

function deriveLabel(figId: FigureId) {
  if (figId === "cicd") {
    return "CI/CD Pipelines";
  }
  return figId
    .split("_")
    .map((word) => capitalize(word))
    .join(" ");
}

export function RoleFig(props: {
  id: FigureId;
  style: FigStyle;
  labelled: boolean;
  totalTales: number;
  taggedTales: number;
}) {
  const label = props.labelled ? deriveLabel(props.id) : null;

  const imageUrl = getFigImageUrl(props.id, props.style);

  return (
    <div
      data-role={props.id}
      style={{
        display: "flex",
        flexDirection: "column",
        float: "left",
        alignItems: "center",
      }}
    >
      {imageUrl ? (
        <>
          <img width={150} src={imageUrl} />
          <span
            style={{
              borderTopStyle: "solid",
              borderBottomStyle: "solid",
              borderWidth: "2px",
              borderColor: "black",
            }}
          >
            {props.labelled ? (
              <b>{label}</b>
            ) : (
              <>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </>
            )}
          </span>
          <span>
            {props.taggedTales} of {props.totalTales} pcs
          </span>
          {/* <span>{FIGURE_CODES[props.id]}</span> */}
        </>
      ) : (
        <>Placeholder for minifig without image</>
      )}
    </div>
  );
}
