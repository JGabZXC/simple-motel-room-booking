export function calculateTotalHours(
  startTime: string,
  endTime: string
): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return !Number.isNaN(diffHours) ? Math.round(diffHours * 100) / 100 : 0;
}
