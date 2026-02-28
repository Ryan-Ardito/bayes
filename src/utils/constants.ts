export const SECTIONS = [
  { id: "intro", title: "What Is Probability?", number: 1 },
  { id: "frequentist", title: "The Frequentist Approach", number: 2 },
  { id: "bayes", title: "Enter Bayes", number: 3 },
  { id: "coin-trial", title: "The Coin Trial", number: 4 },
  { id: "why-it-matters", title: "Why It Matters", number: 5 },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const PRIORS = {
  uniform: { alpha: 1, beta: 1, label: "No opinion (uniform)" },
  weakFair: { alpha: 5, beta: 5, label: "Weakly believe fair" },
  strongFair: { alpha: 20, beta: 20, label: "Strongly believe fair" },
  weakBiased: { alpha: 3, beta: 7, label: "Weakly believe biased (tails)" },
} as const;

export const COLORS = {
  prior: "#6366f1", // indigo
  posterior: "#f59e0b", // amber
  frequentist: "#10b981", // emerald
  accent: "#a855f7", // purple
  correct: "#10b981",
  incorrect: "#ef4444",
  cardBg: "#1e293b", // slate-800
  cardBorder: "#334155", // slate-700
  bg: "#0f172a", // slate-900
  text: "#e2e8f0", // slate-200
  textMuted: "#94a3b8", // slate-400
  highlight: "#fbbf24", // amber-400
} as const;
