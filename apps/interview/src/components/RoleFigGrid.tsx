import { Role, ROLES } from "../content";
import { Interview, InterviewState } from "../beats/types";
import { Store } from "@lauf/store";
import { useRootState } from "@lauf/store-react";
import { RoleFig } from "./RoleFig";
import { initLookup, safeEntries } from "@watchword/core";

interface RoleRecord {
  role: Role;
  totalTales: number;
  taggedTales: number;
}

function aggregateRoleState<I extends Interview<Role>>(
  interview: I,
  interviewState: InterviewState<I>
): RoleRecord[] {
  const accumulated = initLookup(() => ({ total: 0, tagged: 0 }), ...ROLES);
  for (const [taleId, taleState] of safeEntries(interviewState)) {
    const tale = interview[taleId];
    for (const evidenced of tale.roles) {
      accumulated[evidenced].total++;
    }
    for (const taggedRole of taleState.tagged) {
      accumulated[taggedRole].tagged++;
    }
  }
  return safeEntries(accumulated).map(([role, data]) => ({
    role,
    taggedTales: data.tagged,
    totalTales: data.total,
  }));
}

export function RoleFigGrid<I extends Interview<Role>>(props: {
  interview: I;
  interviewStore: Store<InterviewState<I>>;
}) {
  const interviewState = useRootState(props.interviewStore);
  const roleRecords = aggregateRoleState(props.interview, interviewState);

  return (
    <div>
      {roleRecords.map(({ role, totalTales, taggedTales }) => {
        return (
          <RoleFig
            key={role}
            {...{
              id: role,
              taggedTales,
              totalTales,
              labelled: taggedTales > 0,
              style: taggedTales > 0 ? "outline+figure" : "outline",
            }}
          />
        );
      })}
    </div>
  );
}
