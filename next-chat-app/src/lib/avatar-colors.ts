export const AVATAR_COLORS = [
  {
    value: "lime",
    label: "Lime",
    className: "bg-lime-800",
    ringClassName: "ring-lime-500/60",
  },
  {
    value: "emerald",
    label: "Emerald",
    className: "bg-emerald-800",
    ringClassName: "ring-emerald-500/60",
  },
  {
    value: "cyan",
    label: "Cyan",
    className: "bg-cyan-800",
    ringClassName: "ring-cyan-500/60",
  },
  {
    value: "blue",
    label: "Blue",
    className: "bg-blue-800",
    ringClassName: "ring-blue-500/60",
  },
  {
    value: "violet",
    label: "Violet",
    className: "bg-violet-800",
    ringClassName: "ring-violet-500/60",
  },
  {
    value: "rose",
    label: "Rose",
    className: "bg-rose-800",
    ringClassName: "ring-rose-500/60",
  },
] as const;

export type AvatarColor = (typeof AVATAR_COLORS)[number]["value"];

export const DEFAULT_AVATAR_COLOR: AvatarColor = "lime";

export function isAvatarColor(value: string): value is AvatarColor {
  return AVATAR_COLORS.some((color) => color.value === value);
}

export function getAvatarColorClass(color?: string | null) {
  return (
    AVATAR_COLORS.find((avatarColor) => avatarColor.value === color) ??
    AVATAR_COLORS[0]
  ).className;
}
