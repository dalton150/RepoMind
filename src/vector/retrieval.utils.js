export const filterMatchesByDistance = (
  matches,
  maxDistance
) => {
  if (typeof maxDistance !== "number") {
    return matches;
  }

  return matches.filter(
    (match) =>
      typeof match.distance === "number" &&
      match.distance <= maxDistance
  );
};
