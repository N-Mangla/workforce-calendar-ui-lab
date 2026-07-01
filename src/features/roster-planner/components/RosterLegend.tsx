import { Badge } from "../../../shared/components/Badge";

export function RosterLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
      <span className="mr-2 text-sm font-semibold text-slate-700">Legend</span>
      <Badge tone="blue">Work Block</Badge>
      <Badge tone="green">Coaching</Badge>
      <Badge tone="orange">Extra hours</Badge>
      <Badge tone="red">Leave</Badge>
      <Badge tone="slate">Non-working Day</Badge>
      <Badge tone="yellow">Holiday</Badge>
    </div>
  );
}
