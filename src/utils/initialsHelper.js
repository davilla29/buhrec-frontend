export const initials =
  researcher.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2) || "R";
