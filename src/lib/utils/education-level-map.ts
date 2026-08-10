export interface EducationLevelOption {
  value: string;
  label: string;
  group: "ประถมศึกษา" | "มัธยมศึกษา" | "อาชีวศึกษา" | "อุดมศึกษา";
}

// Not a DB enum by design (spec §3: "enum แนะนำในแอป ไม่บังคับ enum ระดับ DB") —
// this list is the single source of truth for onboarding + system-prompt copy.
export const EDUCATION_LEVELS: EducationLevelOption[] = [
  { value: "ป.4", label: "ประถมศึกษาปีที่ 4", group: "ประถมศึกษา" },
  { value: "ป.5", label: "ประถมศึกษาปีที่ 5", group: "ประถมศึกษา" },
  { value: "ป.6", label: "ประถมศึกษาปีที่ 6", group: "ประถมศึกษา" },
  { value: "ม.1", label: "มัธยมศึกษาปีที่ 1", group: "มัธยมศึกษา" },
  { value: "ม.2", label: "มัธยมศึกษาปีที่ 2", group: "มัธยมศึกษา" },
  { value: "ม.3", label: "มัธยมศึกษาปีที่ 3", group: "มัธยมศึกษา" },
  { value: "ม.4", label: "มัธยมศึกษาปีที่ 4", group: "มัธยมศึกษา" },
  { value: "ม.5", label: "มัธยมศึกษาปีที่ 5", group: "มัธยมศึกษา" },
  { value: "ม.6", label: "มัธยมศึกษาปีที่ 6", group: "มัธยมศึกษา" },
  { value: "ปวช.1", label: "ปวช. ปีที่ 1", group: "อาชีวศึกษา" },
  { value: "ปวช.2", label: "ปวช. ปีที่ 2", group: "อาชีวศึกษา" },
  { value: "ปวช.3", label: "ปวช. ปีที่ 3", group: "อาชีวศึกษา" },
  { value: "มหาวิทยาลัยปี1", label: "มหาวิทยาลัยปีที่ 1", group: "อุดมศึกษา" },
  { value: "มหาวิทยาลัยปี2", label: "มหาวิทยาลัยปีที่ 2", group: "อุดมศึกษา" },
  { value: "มหาวิทยาลัยปี3", label: "มหาวิทยาลัยปีที่ 3", group: "อุดมศึกษา" },
  { value: "มหาวิทยาลัยปี4", label: "มหาวิทยาลัยปีที่ 4", group: "อุดมศึกษา" },
];

const LABEL_BY_VALUE = new Map(EDUCATION_LEVELS.map((l) => [l.value, l.label]));

export function educationLevelLabel(value: string): string {
  return LABEL_BY_VALUE.get(value) ?? value;
}

export function isValidEducationLevel(value: string): boolean {
  return LABEL_BY_VALUE.has(value);
}
