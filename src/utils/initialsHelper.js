export const getInitials = (name) => {
  // Fallback if no name is provided (returns "U" for Unknown/User)
  if (!name || typeof name !== "string") return "U";

  return name
    .trim()
    .split(/\s+/) // Splits by one or more spaces safely
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(); // Ensures initials are always capitalized
};
