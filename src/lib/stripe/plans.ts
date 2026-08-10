export const PLANS = {
  free: { name: "Free", price: 0, stripePriceId: null },
  pro: { name: "Pro", price: 399, stripePriceId: process.env.STRIPE_PRICE_PRO ?? null },
  max: { name: "Max", price: 999, stripePriceId: process.env.STRIPE_PRICE_MAX ?? null },
} as const;

export type PlanTier = keyof typeof PLANS;

// TODO: subscription tier limits — pending spec
// ยังไม่ implement: quota ข้อความแชท/วัน, quota สร้างข้อสอบ/เดือน ต่อ tier
// ตอนนี้ทุก tier ใช้งานได้ไม่จำกัด — usage_logs เก็บ log ไว้เฉยๆ รอ logic ภายหลัง
