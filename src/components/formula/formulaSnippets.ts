export interface FormulaSnippet {
  id: string;
  label: string;
  ariaLabel: string;
  /** LaTeX text to insert, already `$`-delimited. */
  insert: string;
  /** Offset range (start, end) within `insert` to select after insertion, so the user can overtype a placeholder immediately. */
  selectOffset?: [number, number];
}

export interface FormulaSnippetGroup {
  label: string;
  snippets: FormulaSnippet[];
}

export const FORMULA_SNIPPET_GROUPS: FormulaSnippetGroup[] = [
  {
    label: "พื้นฐาน",
    snippets: [
      { id: "frac", label: "a/b", ariaLabel: "เศษส่วน", insert: "$\\frac{a}{b}$", selectOffset: [7, 8] },
      { id: "pow", label: "x²", ariaLabel: "เลขยกกำลัง", insert: "$x^{2}$", selectOffset: [4, 5] },
      { id: "sub", label: "x₁", ariaLabel: "ตัวห้อย", insert: "$x_{1}$", selectOffset: [4, 5] },
      { id: "sqrt", label: "√x", ariaLabel: "รากที่สอง", insert: "$\\sqrt{x}$", selectOffset: [7, 8] },
      { id: "nthroot", label: "ⁿ√x", ariaLabel: "รากที่ n", insert: "$\\sqrt[n]{x}$", selectOffset: [10, 11] },
    ],
  },
  {
    label: "กรีก",
    snippets: [
      { id: "alpha", label: "α", ariaLabel: "อัลฟา", insert: "$\\alpha$" },
      { id: "beta", label: "β", ariaLabel: "เบตา", insert: "$\\beta$" },
      { id: "gamma", label: "γ", ariaLabel: "แกมมา", insert: "$\\gamma$" },
      { id: "delta", label: "δ", ariaLabel: "เดลตา", insert: "$\\delta$" },
      { id: "theta", label: "θ", ariaLabel: "ทีตา", insert: "$\\theta$" },
      { id: "lambda", label: "λ", ariaLabel: "แลมบ์ดา", insert: "$\\lambda$" },
      { id: "mu", label: "μ", ariaLabel: "มิว", insert: "$\\mu$" },
      { id: "pi", label: "π", ariaLabel: "พาย", insert: "$\\pi$" },
      { id: "sigma", label: "σ", ariaLabel: "ซิกมา", insert: "$\\sigma$" },
      { id: "phi", label: "φ", ariaLabel: "ฟาย", insert: "$\\phi$" },
      { id: "omega", label: "ω", ariaLabel: "โอเมกา", insert: "$\\omega$" },
      { id: "Delta", label: "Δ", ariaLabel: "เดลตาใหญ่", insert: "$\\Delta$" },
      { id: "Omega", label: "Ω", ariaLabel: "โอเมกาใหญ่", insert: "$\\Omega$" },
      { id: "Sigma", label: "Σ", ariaLabel: "ซิกมาใหญ่", insert: "$\\Sigma$" },
    ],
  },
  {
    label: "ฟิสิกส์/คณิตศาสตร์",
    snippets: [
      { id: "vec", label: "F⃗", ariaLabel: "เวกเตอร์", insert: "$\\vec{F}$", selectOffset: [5, 6] },
      { id: "sum", label: "Σᵢ", ariaLabel: "ผลรวม", insert: "$\\sum_{i=1}^{n}$" },
      { id: "int", label: "∫", ariaLabel: "อินทิกรัล", insert: "$\\int$" },
      { id: "deltax", label: "Δx", ariaLabel: "การเปลี่ยนแปลง", insert: "$\\Delta x$" },
      { id: "deg", label: "°", ariaLabel: "องศา", insert: "$^{\\circ}$" },
      { id: "cdot", label: "·", ariaLabel: "คูณ (จุด)", insert: "$\\cdot$" },
      { id: "times", label: "×", ariaLabel: "คูณ (กากบาท)", insert: "$\\times$" },
      { id: "pm", label: "±", ariaLabel: "บวกลบ", insert: "$\\pm$" },
      { id: "infty", label: "∞", ariaLabel: "อนันต์", insert: "$\\infty$" },
      { id: "leq", label: "≤", ariaLabel: "น้อยกว่าหรือเท่ากับ", insert: "$\\leq$" },
      { id: "geq", label: "≥", ariaLabel: "มากกว่าหรือเท่ากับ", insert: "$\\geq$" },
    ],
  },
];
