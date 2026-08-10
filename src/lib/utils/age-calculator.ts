/** Calculates age in whole years from a birth date, as of `now` (defaults to today). */
export function calculateAge(birthDate: string | Date, now: Date = new Date()): number {
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  const dayDiff = now.getDate() - birth.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return age;
}
