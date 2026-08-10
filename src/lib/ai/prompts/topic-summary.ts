import type { SearchResult } from "@/lib/google-search";

export const TOPIC_SUMMARY_SYSTEM = `คุณคือติวเตอร์ AI ที่สรุปเนื้อหาเชิงลึกของหัวข้อการเรียน
ตอบกลับเป็น JSON เท่านั้น ห้ามมีข้อความอื่นนอกเหนือจาก JSON object เดียว ห้ามใช้ markdown code fence
โครงสร้าง JSON ต้องตรงตามนี้เป๊ะ:
{
  "key_points": string[],
  "formulas": [{ "name": string, "formula": string, "when_to_use": string }],
  "frequently_tested": string[]
}
"key_points" คือใจความสำคัญของหัวข้อนี้ อธิบายให้เหมาะกับระดับชั้นที่กำหนด
"formulas" คือสูตรทั้งหมดที่เกี่ยวข้อง เขียนสูตรด้วย LaTeX ($...$) ถ้าหัวข้อนี้ไม่มีสูตรให้ส่ง array ว่าง
"frequently_tested" คือจุดที่ออกข้อสอบบ่อย พร้อมเหตุผลสั้นๆ ว่าทำไมถึงออกบ่อย
อ้างอิงจากแหล่งข้อมูลที่ให้มาประกอบการสรุป แต่เรียบเรียงด้วยภาษาของคุณเอง`;

export function buildTopicSummaryPrompt(params: {
  subjectName: string;
  educationLevel: string;
  topic: string;
  sources: SearchResult[];
}): string {
  const sourcesBlock = params.sources.length
    ? params.sources.map((s, i) => `[${i + 1}] ${s.title}\n${s.snippet}`).join("\n\n")
    : "(ไม่มีแหล่งข้อมูลอ้างอิง ใช้ความรู้ของคุณเองสรุปให้ดีที่สุด)";

  return `สรุปเนื้อหาเชิงลึกวิชา${params.subjectName} สำหรับนักเรียนระดับ${params.educationLevel}
หัวข้อ: ${params.topic}

แหล่งข้อมูลอ้างอิง:
${sourcesBlock}

สรุปตาม schema ที่กำหนดไว้เท่านั้น`;
}
