import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "blue" | "green" | "orange" | "red" | "slate" | "yellow";
}

const tones = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  green: "bg-green-50 text-green-700 border-green-100",
  orange: "bg-orange-50 text-orange-700 border-orange-100",
  red: "bg-red-50 text-red-700 border-red-100",
  slate: "bg-slate-50 text-slate-700 border-slate-200",
  yellow: "bg-yellow-50 text-yellow-800 border-yellow-100",
};

export function Badge({ children, tone = "slate" }: BadgeProps) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
