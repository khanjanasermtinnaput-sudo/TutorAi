# TUTOR AI — Master Build Prompt (Claude Code CLI)

> **บทบาทของคุณ (Claude Code):** คุณคือทีมที่ประกอบด้วย World-class UI/UX Designer, Senior Software Engineer, AI Engineer, และ Data Engineer ทำงานร่วมกันสร้างแอป **Tutor AI** — แพลตฟอร์มติวเตอร์ AI แบบแชทที่สร้างข้อสอบ วิเคราะห์เนื้อหา และปรับตัวตามผู้เรียนแต่ละคน
>
> อ่าน prompt นี้ทั้งหมดก่อนเริ่มโค้ดบรรทัดแรก ทำตามลำดับ Phase ที่ระบุ ห้ามข้าม ห้ามเดา schema เอง — ทุกจุดที่ไม่ชัดเจนให้ใช้ค่า default ที่ระบุไว้ใน prompt นี้

---

## 0. ภาพรวมโปรเจกต์

**ชื่อ:** Tutor AI
**คืออะไร:** เว็บแอปติวเตอร์ AI ที่นักเรียนคุยแบบแชทถามตอบเนื้อหาเรียน, ขอสรุปเนื้อหาเชิงลึกพร้อมสูตร, และสั่งสร้างข้อสอบปรนัย 4 ตัวเลือกจำนวน 10–20 ข้อ พร้อมเฉลยละเอียดหลังทำเสร็จ ระบบจำข้อมูลผู้เรียน (ชื่อเล่น, วันเกิด, ระดับชั้น) เพื่อปรับความยากและวิธีอธิบายให้เหมาะกับแต่ละคน

**สิ่งที่ต้องมี (functional requirements แบบย่อ อ่านรายละเอียด Phase 2-6):**
1. Login ด้วย Gmail (Supabase Auth + Google OAuth) ก่อนเข้าเว็บ
2. Onboarding ครั้งแรก: กรอกชื่อเล่น, วันเดือนปีเกิด, ระดับชั้นการศึกษา
3. หน้าแชทหลัก: เลือกวิชาได้จาก dropdown/pill selector ในแชท
4. AI ใช้ข้อมูลผู้เรียน (อายุจากวันเกิด, ระดับชั้น, วิชา) ปรับ system prompt แบบ dynamic
5. ปุ่ม "สร้างข้อสอบ" ในแชท → modal เลือกจำนวนข้อ (10-20), ระดับความยาก, เรื่อง/บทที่ต้องการ
6. หลังทำข้อสอบเสร็จ → แสดงคะแนน + เฉลยละเอียดทุกข้อ (วิธีคิด step-by-step)
7. โหมด "ดูเนื้อหาเชิงลึก" ต่อเรื่อง: สรุปใจความสำคัญ, รายการสูตรทั้งหมด, mark จุดที่ออกข้อสอบบ่อย
8. ระบบดึงข้อมูลอ้างอิงจริงจาก Google Search API เพื่อความถูกต้อง (มี citation)
9. AI ตอบผ่าน OpenRouter + Gemini (มี fallback ระหว่างสองผู้ให้บริการ)
10. Save chat history แยกตาม Gmail account ของผู้ใช้ (multi-session, ดูย้อนหลังได้)
11. Subscription: Free / Pro (฿399) / Max (฿999) ผูก Stripe — **schema เตรียมไว้ แต่ business logic ของสิทธิ์แต่ละ tier ใส่ `TODO` รอ spec เพิ่มเติม**
12. ดีไซน์: **iOS 26 Liquid Glass** — ของเหลว/หยดน้ำ ไม่ใช่แค่ blur เฉยๆ

**สิ่งที่ยังไม่ต้องทำตอนนี้ (out of scope รอบนี้):**
- รายละเอียด quota/limit ของแต่ละ subscription tier (คำนวณ usage, rate limit ต่อวัน) → ใส่ `// TODO: subscription tier limits — pending spec`
- Admin dashboard
- Mobile native app (ทำเป็น responsive web ก่อน)

---

## 1. Tech Stack (บังคับ)

| Layer | เทคโนโลยี |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend/API | Next.js API Routes (หรือ Route Handlers) |
| Database + Auth | Supabase (Postgres, Auth, Realtime, Row Level Security) |
| AI Provider | OpenRouter (primary router) + Gemini API (ตรงหรือผ่าน OpenRouter) — ต้องมี fallback logic |
| Web Search | Google Search API (Custom Search JSON API) สำหรับดึงเนื้อหาอ้างอิง |
| Payment | Stripe (Checkout + Webhook) — โครงสร้างเตรียมไว้ ธุรกิจ logic ใส่ TODO |
| Deployment | Vercel |
| State/Data fetching | React Query (TanStack Query) |
| Animation | Framer Motion (จำเป็นมากสำหรับ Liquid Glass effect) |

---

## 2. Design System — "iOS 26 Liquid Glass"

> **สำคัญมาก:** นี่ไม่ใช่ glassmorphism แบบเดิม (blur + opacity + border ธรรมดา) ที่เห็นทั่วไปปี 2020-2023 คุณต้องสร้าง **Liquid Glass** — พื้นผิวที่ประพฤติตัวเหมือนหยดน้ำ/เจลใส มี refraction, specular highlight, และการบิดตัวของแสงเมื่อ interact ไม่ใช่แค่เบลอพื้นหลัง

### 2.1 หลักการ Liquid Glass (ต้องทำให้ได้ทุกข้อ)

1. **Refraction ไม่ใช่แค่ Blur** — พื้นผิวกระจกต้องมี `backdrop-filter: blur()` ร่วมกับ subtle chromatic aberration หรือ distortion ที่ขอบ (ใช้ SVG `feDisplacementMap` filter หรือ CSS `filter` layer ซ้อนเพื่อจำลองการหักเหแสงที่ขอบวัตถุ คล้ายหยดน้ำบนกระจก)
2. **Specular Highlight เคลื่อนไหวได้** — เส้นแสงสะท้อนบาง ๆ (1-2px) ที่ขอบบนของ surface โค้งตามรูปทรง ไม่ใช่เส้นตรง ให้ opacity สูงสุดที่มุมหนึ่งแล้วจางลง เหมือนแสงสะท้อนบนผิวโค้งของหยดน้ำ
3. **Dynamic Tinting** — กระจกไม่ได้ใส่แบบเดียวกันทุกที่ ให้มี tint สีอ่อนแตกต่างกันเล็กน้อยตาม context (เช่น การ์ดข้อสอบที่ถูก = tint เขียวอมฟ้าจาง ๆ, การ์ดผิด = tint แดงอมส้มจาง ๆ) โดยความอิ่มตัวสีต้องต่ำมาก (< 15% saturation overlay)
4. **Depth ผ่านการซ้อนชั้น (layered blur)** — layer ที่อยู่ลึกกว่าเบลอมากกว่า, layer บนสุด (เช่น floating action button, modal) เบลอน้อยแต่ shadow นุ่มลึก
5. **Elastic Motion** — ทุก interaction (tap, drag, open modal) ใช้ spring animation ที่มี overshoot เล็กน้อย (คล้ายเจล/หยดน้ำสั่นตัว) ไม่ใช่ ease-in-out เชิงเส้น — ใช้ Framer Motion `type: "spring", stiffness: 300-400, damping: 20-25`
6. **Droplet Morphing** — เมื่อเปิด/ปิด panel หรือ modal ให้รูปทรงเริ่มจากจุดเล็กแล้วขยายเป็นทรงหยดน้ำ (border-radius ไม่สมมาตร ระหว่าง transition) ก่อนจะนิ่งเป็นสี่เหลี่ยมมุมมนปกติ

### 2.2 Design Tokens

```yaml
colors:
  # Base canvas — โทนสว่างนวล ไม่ขาวจัด เพื่อให้กระจกลอยเด่น
  canvas-light: "#F4F6FA"
  canvas-dark: "#0B0E14"          # dark mode base
  canvas-elevated-light: "rgba(255,255,255,0.55)"
  canvas-elevated-dark: "rgba(22,26,36,0.55)"

  # Glass surface tokens
  glass-surface-1: "rgba(255,255,255,0.14)"   # การ์ดชั้นลึกสุด (บล็อกแชท)
  glass-surface-2: "rgba(255,255,255,0.22)"   # การ์ดชั้นกลาง (side panel)
  glass-surface-3: "rgba(255,255,255,0.32)"   # การ์ดชั้นบนสุด (modal, FAB)
  glass-border: "rgba(255,255,255,0.45)"      # ขอบกระจก 1px
  glass-highlight: "rgba(255,255,255,0.85)"   # specular line

  # Ink / text
  ink-primary: "#12151C"
  ink-secondary: "#4A5063"
  ink-muted: "#8A90A3"

  # Accent — สีหลักของแบรนด์ (โทนน้ำ/ฟ้าอมม่วง สื่อถึง "หยดน้ำ")
  accent-primary: "#3D7EFF"
  accent-primary-deep: "#2657D9"
  accent-secondary: "#8B5CF6"
  gradient-liquid: "linear-gradient(135deg, #3D7EFF 0%, #8B5CF6 55%, #22D3EE 100%)"

  # Semantic — ใช้ tint ต่ำมาก
  success: "#22C55E"
  success-tint: "rgba(34,197,94,0.10)"
  error: "#EF4444"
  error-tint: "rgba(239,68,68,0.10)"
  warning: "#F59E0B"
  warning-tint: "rgba(245,158,11,0.10)"

typography:
  fontFamily: "'SF Pro Display', 'Noto Sans Thai', Inter, sans-serif"
  # ใช้ Noto Sans Thai คู่กับ SF Pro เพราะเนื้อหาเป็นภาษาไทยเป็นหลัก
  display-xl: { size: 40px, weight: 700, lineHeight: 46px, letterSpacing: -0.5px }
  heading-lg: { size: 28px, weight: 700, lineHeight: 34px, letterSpacing: -0.3px }
  heading-md: { size: 20px, weight: 600, lineHeight: 26px }
  body-lg: { size: 16px, weight: 400, lineHeight: 24px }
  body-md: { size: 14px, weight: 400, lineHeight: 20px }
  caption: { size: 12px, weight: 500, lineHeight: 16px }

radius:
  sm: 12px
  md: 18px
  lg: 24px
  xl: 32px
  droplet: "42% 58% 63% 37% / 41% 44% 56% 59%"   # ใช้เฉพาะ transition state
  full: 9999px

blur:
  layer-1: 40px   # background canvas blur (ไกลสุด)
  layer-2: 24px   # card กลาง
  layer-3: 12px   # floating top layer

shadow:
  glass-rest: "0 8px 32px rgba(31, 41, 84, 0.12), inset 0 1px 0 rgba(255,255,255,0.5)"
  glass-elevated: "0 16px 48px rgba(31, 41, 84, 0.18), inset 0 1px 0 rgba(255,255,255,0.6)"
  glass-pressed: "0 4px 12px rgba(31, 41, 84, 0.10), inset 0 1px 0 rgba(255,255,255,0.4)"
```

### 2.3 Component Spec สำคัญ

- **`glass-card`**: `background: glass-surface-2`, `backdrop-filter: blur(24px) saturate(180%)`, border 1px `glass-border`, radius `radius.lg`, shadow `glass-rest` พร้อม pseudo-element `::before` วาง specular highlight โค้งที่มุมบนซ้าย
- **`glass-chat-bubble`** (AI): พื้นหลัง `glass-surface-1`, มุมด้านที่ชิด avatar ใช้ radius เล็กกว่า (asymmetric, คล้ายหยดน้ำเกาะ)
- **`glass-chat-bubble`** (User): พื้นหลัง gradient-liquid ที่ opacity 85% + blur เบา ให้ตัวอักษรอ่านง่าย
- **`glass-fab`** (ปุ่มลอย "สร้างข้อสอบ"): `glass-surface-3`, blur เยอะสุด, shadow `glass-elevated`, ตอนกดมี ripple แบบหยดน้ำกระจาย (SVG animation)
- **`glass-modal`**: เปิดด้วย droplet morph (radius เปลี่ยนจาก droplet → lg ระหว่าง 250ms), ฉากหลังมี overlay blur เพิ่มความลึก
- **`quiz-option-card`**: 4 ตัวเลือก เป็น glass-card ขนาดเท่ากัน, ตอนเลือกแล้ว → tint accent, ตอนเฉลย ถูก = success-tint กับขอบเรืองแสงเขียวจาง, ผิด = error-tint ขอบแดงจาง (ห้ามใช้สีทึบเต็มพื้นหลัง)
- **`subject-pill-selector`**: pill กระจกเรียงแนวนอน scroll ได้ในแชท, pill ที่เลือกอยู่มี gradient-liquid fill อ่อน ๆ

### 2.4 Reference & Constraint
- ใช้ Vercel Geist doc (แนบใน `/docs/reference/geist-reference.md`) เป็น **ต้นแบบวิธีจัดระบบ token/component spec เท่านั้น** (spacing scale 4px-based, การตั้งชื่อ component, การเขียน Do's/Don'ts) — **ห้ามนำ palette ขาว-ดำ-flat ของ Geist มาใช้จริง** ดีไซน์สุดท้ายต้องเป็น Liquid Glass ตาม 2.1-2.3 เท่านั้น
- Dark mode ต้องรองรับตั้งแต่ต้น (glass บน dark canvas ยิ่งเห็น refraction ชัด)
- ทุก glass surface ต้องผ่าน contrast check (WCAG AA) สำหรับตัวหนังสือบนกระจก — ถ้า blur ทำให้ contrast ไม่พอ ให้เพิ่ม scrim (dark overlay 8-12%) ใต้ตัวอักษรแทนการลด blur

---

## 3. Database Schema (Supabase / Postgres)

สร้างไฟล์ migration ที่ `/supabase/migrations/0001_init.sql` ครอบคลุมตารางต่อไปนี้ (เปิด RLS ทุกตาราง, policy ผูกกับ `auth.uid()`):

```sql
-- ผู้ใช้ (ต่อยอดจาก auth.users ของ Supabase)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nickname text not null,
  birth_date date not null,
  education_level text not null,   -- เช่น 'ม.1'..'ม.6', 'ปวช.', 'มหาวิทยาลัยปี1' ฯลฯ (enum แนะนำในแอป ไม่บังคับ enum ระดับ DB)
  onboarding_completed boolean default false,
  subscription_tier text not null default 'free',  -- 'free' | 'pro' | 'max'
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'inactive',      -- 'active' | 'past_due' | 'canceled' | 'inactive'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- วิชา (master data, seed ไว้ล่วงหน้า)
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,              -- เช่น 'คณิตศาสตร์', 'ฟิสิกส์', 'เคมี'
  icon text,
  sort_order int default 0
);

-- ห้องแชท (1 ผู้ใช้มีได้หลายห้อง แยกตามวิชา/หัวข้อ)
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid references public.subjects(id),
  title text not null default 'แชทใหม่',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ข้อความในแชท
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  citations jsonb,                 -- [{title, url, snippet}] จาก Google Search
  ai_provider text,                -- 'openrouter' | 'gemini'
  created_at timestamptz default now()
);

-- ชุดข้อสอบที่สร้าง
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid references public.chat_sessions(id),
  subject_id uuid references public.subjects(id),
  topic text not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  question_count int not null check (question_count between 10 and 20),
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  score int,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- คำถามแต่ละข้อในชุดข้อสอบ
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  order_index int not null,
  question_text text not null,
  choices jsonb not null,          -- {"A": "...", "B": "...", "C": "...", "D": "..."}
  correct_choice text not null check (correct_choice in ('A','B','C','D')),
  explanation text not null,       -- เฉลยละเอียดแบบ step-by-step
  user_answer text,
  is_correct boolean
);

-- สรุปเนื้อหาเชิงลึกต่อเรื่อง (cache ผลลัพธ์ AI เพื่อไม่ต้องสร้างซ้ำ)
create table public.topic_summaries (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id),
  topic text not null,
  education_level text not null,
  summary_content jsonb not null,  -- {key_points: [], formulas: [{name, formula, when_to_use}], frequently_tested: []}
  sources jsonb,                   -- citations จาก Google Search
  created_at timestamptz default now(),
  unique (subject_id, topic, education_level)
);

-- TODO: subscription tier limits — pending spec (ยังไม่ implement usage limit logic)
create table public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action_type text not null,       -- 'chat_message' | 'quiz_generated'
  created_at timestamptz default now()
);
```

**RLS policy pattern** (ใช้กับทุกตารางที่มี `user_id`):
```sql
alter table public.chat_sessions enable row level security;
create policy "Users manage own chat sessions"
  on public.chat_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
-- ทำซ้ำ pattern เดียวกันกับ quizzes, usage_logs
-- chat_messages และ quiz_questions ตรวจสิทธิ์ผ่าน join กับตารางแม่ (session_id / quiz_id)
```

---

## 4. โครงสร้างไฟล์โปรเจกต์ (บังคับตามนี้)

```
tutor-ai/
├── docs/
│   └── reference/
│       └── geist-reference.md          # เก็บ Vercel doc ไว้อ้างอิง structure เท่านั้น
├── supabase/
│   └── migrations/
│       └── 0001_init.sql
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx          # หน้า login Gmail
│   │   │   └── onboarding/page.tsx     # กรอกชื่อเล่น/วันเกิด/ระดับชั้น
│   │   ├── (main)/
│   │   │   ├── layout.tsx              # sidebar + top bar กระจก
│   │   │   ├── chat/
│   │   │   │   ├── page.tsx            # หน้าแชทหลัก (session ล่าสุด/ใหม่)
│   │   │   │   └── [sessionId]/page.tsx
│   │   │   ├── topic/[subjectId]/[topic]/page.tsx   # หน้าเนื้อหาเชิงลึก
│   │   │   ├── quiz/
│   │   │   │   ├── [quizId]/page.tsx          # หน้าทำข้อสอบ
│   │   │   │   └── [quizId]/result/page.tsx   # หน้าผลคะแนน+เฉลย
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       └── billing/page.tsx    # หน้า subscription (Stripe)
│   │   ├── api/
│   │   │   ├── chat/route.ts                  # POST ส่งข้อความ → AI (streaming)
│   │   │   ├── quiz/generate/route.ts         # POST สร้างข้อสอบ
│   │   │   ├── quiz/submit/route.ts           # POST ส่งคำตอบ+คำนวณคะแนน
│   │   │   ├── topic-summary/route.ts         # GET/POST สรุปเนื้อหาเชิงลึก
│   │   │   ├── search/route.ts                # เรียก Google Search API
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/route.ts          # สร้าง Stripe Checkout session
│   │   │   │   └── webhook/route.ts           # รับ webhook อัปเดต subscription_status
│   │   │   └── auth/callback/route.ts         # Supabase OAuth callback
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── glass/                       # primitive components ของ design system
│   │   │   ├── GlassCard.tsx
│   │   │   ├── GlassButton.tsx
│   │   │   ├── GlassModal.tsx
│   │   │   ├── GlassFab.tsx
│   │   │   ├── GlassChatBubble.tsx
│   │   │   ├── GlassPillSelector.tsx
│   │   │   └── DropletTransition.tsx    # wrapper animation morph
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── SubjectSelector.tsx
│   │   │   └── MessageBubble.tsx
│   │   ├── quiz/
│   │   │   ├── QuizGeneratorModal.tsx   # เลือกจำนวนข้อ/ความยาก/หัวข้อ
│   │   │   ├── QuizQuestionCard.tsx
│   │   │   ├── QuizProgressBar.tsx
│   │   │   └── QuizResultSummary.tsx    # หน้าเฉลยละเอียด
│   │   ├── topic/
│   │   │   ├── FormulaList.tsx
│   │   │   ├── KeyPointsSummary.tsx
│   │   │   └── FrequentlyTestedBadge.tsx
│   │   └── onboarding/
│   │       ├── NicknameStep.tsx
│   │       ├── BirthdateStep.tsx
│   │       └── EducationLevelStep.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── ai/
│   │   │   ├── openrouter.ts            # client + model config
│   │   │   ├── gemini.ts                # client
│   │   │   ├── ai-router.ts             # เลือก provider + fallback logic
│   │   │   ├── prompts/
│   │   │   │   ├── system-prompt.ts     # dynamic prompt จาก profile ผู้ใช้
│   │   │   │   ├── quiz-generation.ts
│   │   │   │   └── topic-summary.ts
│   │   ├── google-search.ts             # Google Custom Search API wrapper
│   │   ├── stripe/
│   │   │   ├── client.ts
│   │   │   └── plans.ts                 # นิยาม 3 tier (ราคา, Stripe price ID)
│   │   └── utils/
│   │       ├── age-calculator.ts        # คำนวณอายุจาก birth_date
│   │       └── education-level-map.ts
│   ├── hooks/
│   │   ├── useChatSession.ts
│   │   ├── useQuiz.ts
│   │   └── useSubscription.ts
│   ├── types/
│   │   ├── database.types.ts            # gen จาก supabase gen types
│   │   ├── chat.types.ts
│   │   └── quiz.types.ts
│   └── styles/
│       └── glass-tokens.css             # CSS variables จาก design tokens ข้อ 2.2
├── .env.local.example
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 5. AI Logic รายละเอียด

### 5.1 Dynamic System Prompt
สร้างที่ `src/lib/ai/prompts/system-prompt.ts` — ต้องดึงข้อมูลจาก `profiles` table มาประกอบ prompt แบบนี้:

```
คุณคือติวเตอร์ AI ส่วนตัวของ {nickname}
- อายุ: {calculated_age} ปี (คำนวณจาก birth_date)
- ระดับชั้น: {education_level}
- วิชาที่กำลังเรียนตอนนี้: {current_subject}

ปรับระดับภาษาและความลึกของคำอธิบายให้เหมาะกับระดับชั้นนี้โดยเฉพาะ
ใช้ตัวอย่างที่เด็กวัยนี้เข้าใจง่าย ถ้าเป็นเนื้อหาที่มีสูตร ให้อธิบายที่มาของสูตรก่อนใช้งานจริง
...
```

### 5.2 AI Router (OpenRouter + Gemini fallback)
`src/lib/ai/ai-router.ts`:
- Primary: เรียกผ่าน OpenRouter (เลือกโมเดลที่ config ได้ผ่าน env var `OPENROUTER_MODEL`)
- ถ้า OpenRouter timeout/error → fallback เรียก Gemini API ตรง
- Log provider ที่ใช้จริงลง `chat_messages.ai_provider` ทุกครั้ง
- Streaming response ทั้งสอง provider (ใช้ Server-Sent Events หรือ Vercel AI SDK `streamText`)

### 5.3 Google Search Integration
`src/lib/google-search.ts` — ใช้ Google Custom Search JSON API:
- เรียกเมื่อ AI ต้องการข้อมูลอ้างอิงจริง (ก่อนตอบคำถามเชิงเนื้อหา หรือก่อนสร้าง topic summary)
- Parse ผลลัพธ์เป็น `{title, url, snippet}[]` เก็บใน `citations` (chat_messages) หรือ `sources` (topic_summaries)
- แสดง citation เป็น pill กระจกเล็ก ๆ ท้ายข้อความ AI ที่กดแล้วเปิดลิงก์ต้นทาง

### 5.4 Quiz Generation
`src/app/api/quiz/generate/route.ts`:
- Input: `subject_id`, `topic`, `difficulty` (easy/medium/hard), `question_count` (10-20)
- AI prompt ต้อง return JSON schema เคร่งครัด (ใช้ `response_format: json_schema` ถ้า provider รองรับ หรือ parse+validate ด้วย Zod):
  ```ts
  {
    questions: [{
      question_text: string,
      choices: { A: string, B: string, C: string, D: string },
      correct_choice: "A"|"B"|"C"|"D",
      explanation: string   // ต้องเป็น step-by-step ละเอียด ไม่ใช่แค่บอกคำตอบ
    }]
  }
  ```
- Validate ด้วย Zod ก่อน insert ลง `quiz_questions` — ถ้า AI ตอบ format ผิด ให้ retry 1 ครั้งก่อน error

### 5.5 Topic Deep-Dive Summary
`src/app/api/topic-summary/route.ts`:
- เช็ค cache ใน `topic_summaries` ก่อน (unique key: subject + topic + education_level) — ถ้ามีแล้วไม่เรียก AI ซ้ำ
- ถ้าไม่มี: เรียก Google Search หาข้อมูลอ้างอิง → ส่งให้ AI สรุปเป็น JSON:
  ```ts
  {
    key_points: string[],                                    // ใจความสำคัญ
    formulas: [{ name: string, formula: string, when_to_use: string }][],
    frequently_tested: string[]                               // จุดที่ออกข้อสอบบ่อย พร้อมเหตุผลสั้นๆ
  }
  ```

---

## 6. Flow หลักของแอป (ต้อง implement ตามลำดับนี้)

1. **Login** → Supabase Auth Google OAuth → redirect `/onboarding` ถ้า `onboarding_completed = false`, ไม่งั้นไป `/chat`
2. **Onboarding** (3 step ใน glass modal เดียว, droplet transition ระหว่าง step): ชื่อเล่น → วันเกิด (date picker กระจก) → ระดับชั้น (grid เลือก) → บันทึก `profiles` → ไป `/chat`
3. **หน้าแชท**: `SubjectSelector` pill อยู่เหนือ chat input, เลือกวิชา → บันทึกใน `chat_sessions.subject_id` → ทุกข้อความถัดไปใช้ system prompt ที่ inject วิชานี้
4. **ปุ่ม FAB "สร้างข้อสอบ"** ลอยมุมขวาล่างของหน้าแชท → เปิด `QuizGeneratorModal` (droplet morph) → เลือกจำนวนข้อ/ความยาก/หัวข้อ (auto-suggest จากบทสนทนาล่าสุดถ้ามี) → submit → redirect ไปหน้าทำข้อสอบ
5. **หน้าทำข้อสอบ**: ทีละข้อหรือเลื่อนดูทั้งหมดได้ (ให้ toggle), เลือกคำตอบ → progress bar กระจกด้านบน
6. **หน้าผลลัพธ์**: คะแนนรวมใหญ่กลางจอ (glass card เด่น) → รายการข้อทั้งหมด แต่ละข้อกดขยายดูเฉลยละเอียด + สีเขียว/แดง tint ตามถูกผิด
7. **หน้าเนื้อหาเชิงลึก**: เข้าถึงได้จากปุ่มในแชท ("ดูสรุปเรื่องนี้แบบละเอียด") → แสดง key points, สูตรทั้งหมดเป็น card แยก, badge "ออกสอบบ่อย" ติดจุดสำคัญ
8. **Settings/Billing**: แสดง tier ปัจจุบัน, ปุ่ม upgrade → Stripe Checkout → webhook อัปเดต `subscription_tier`/`subscription_status`

---

## 7. Stripe (โครงสร้างเตรียมพร้อม — business logic ใส่ TODO)

`src/lib/stripe/plans.ts`:
```ts
export const PLANS = {
  free: { name: 'Free', price: 0, stripePriceId: null },
  pro:  { name: 'Pro',  price: 399, stripePriceId: process.env.STRIPE_PRICE_PRO },
  max:  { name: 'Max',  price: 999, stripePriceId: process.env.STRIPE_PRICE_MAX },
} as const;

// TODO: subscription tier limits — pending spec
// ยังไม่ implement: quota ข้อความแชท/วัน, quota สร้างข้อสอบ/เดือน ต่อ tier
// ตอนนี้ทุก tier ใช้งานได้ไม่จำกัด — usage_logs เก็บ log ไว้เฉยๆ รอ logic ภายหลัง
```

- `/api/stripe/checkout`: สร้าง Checkout session ผูก `profiles.stripe_customer_id`
- `/api/stripe/webhook`: ฟัง event `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` → sync `subscription_tier` + `subscription_status`
- หน้า `/settings/billing`: การ์ดกระจก 3 ใบเทียบ tier (Free/Pro ฿399/Max ฿999) — ใส่ placeholder feature list พร้อม comment `{/* TODO: feature list per tier — pending spec */}`

---

## 8. Environment Variables (`.env.local.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENROUTER_API_KEY=
OPENROUTER_MODEL=

GEMINI_API_KEY=

GOOGLE_SEARCH_API_KEY=
GOOGLE_SEARCH_ENGINE_ID=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO=
STRIPE_PRICE_MAX=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_APP_URL=
```

---

## 9. ลำดับการ Build (Phase-by-Phase)

**Phase 1 — Foundation**
- Init Next.js 14 + TypeScript + Tailwind
- ตั้งค่า Supabase client (browser/server/middleware)
- สร้าง migration `0001_init.sql` + RLS policies ทั้งหมด
- สร้าง `glass-tokens.css` จาก design tokens ข้อ 2.2 + `tailwind.config.ts` extend ด้วย tokens นี้

**Phase 2 — Auth + Onboarding**
- Google OAuth login ผ่าน Supabase
- Onboarding flow 3 step พร้อม droplet transition
- Middleware guard: ยังไม่ onboarding → บังคับไปหน้า onboarding

**Phase 3 — Glass Component Library**
- สร้าง primitives ทั้งหมดใน `components/glass/` ตาม spec ข้อ 2.3 ก่อน แล้วค่อยประกอบเป็นหน้าจริง
- ทำ storybook-like preview page `/dev/glass-preview` (ลบทิ้งก่อน production ก็ได้ แต่ช่วย debug ระหว่าง build)

**Phase 4 — Chat Core**
- AI router (OpenRouter + Gemini fallback)
- Dynamic system prompt จาก profile
- Streaming chat UI
- Subject selector + session management + save/load history แยกตาม user

**Phase 5 — Quiz System**
- Quiz generation API + Zod validation
- หน้าทำข้อสอบ + หน้าผลลัพธ์/เฉลยละเอียด

**Phase 6 — Topic Deep-Dive**
- Google Search integration
- Topic summary generation + cache
- หน้าแสดงสูตร/key points/frequently tested

**Phase 7 — Stripe (โครงสร้างเท่านั้น)**
- Checkout + webhook + หน้า billing ตามข้อ 7 (logic สิทธิ์ทิ้ง TODO ไว้)

**Phase 8 — Polish**
- Dark mode toggle
- Responsive (มือถือ: chat เต็มจอ, FAB ขยับตำแหน่งไม่บังคีย์บอร์ด)
- Loading skeleton แบบกระจก (shimmer เป็นเงาไหลผ่านผิวกระจก ไม่ใช่ grey bar ธรรมดา)

---

## 10. Constraints ห้ามฝ่าฝืน

- ห้าม hardcode API key ในโค้ด — ใช้ env var เท่านั้น
- ห้ามปิด RLS บนตารางไหนเด็ดขาด
- ห้ามให้ quiz explanation เป็นแค่ "คำตอบคือ B" — ต้องอธิบายวิธีคิดละเอียดทุกข้อ
- ห้ามลืม fallback เมื่อ AI provider หลักล่ม (ต้องมี try/catch + switch provider จริง ทดสอบได้)
- ห้ามใช้ glassmorphism แบบ flat blur ธรรมดา — ทุก glass surface ต้องมี specular highlight + border glow ตามข้อ 2.1
- Subscription tier logic ที่ยังไม่ระบุ (limit/quota) ต้องมี comment `// TODO: subscription tier limits — pending spec` กำกับไว้ชัดเจน ไม่ใช่เดาเอง

---

## 11. Deliverable ที่ต้องการเมื่อจบแต่ละ Phase

รายงานสั้น ๆ ท้าย Phase: ไฟล์ที่สร้าง/แก้, คำสั่งรัน migration/test ที่ต้อง verify, และจุดที่ยัง TODO ค้างอยู่ — ไม่ต้องอธิบายทีละบรรทัดระหว่างทำ ทำให้เสร็จเป็น phase แล้วสรุปรวบยอด
