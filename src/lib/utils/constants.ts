export const BRANDS = [
  "Nike",
  "adidas",
  "ASICS",
  "New Balance",
  "HOKA",
  "Saucony",
  "Mizuno",
  "Brooks",
] as const;

export const SHOE_CATEGORIES = {
  daily: "デイリートレーナー",
  tempo: "テンポ/スピード",
  race: "レース",
  recovery: "リカバリー",
  trail: "トレイル",
} as const;

export const CUSHION_TYPES = {
  max: "マックスクッション",
  moderate: "モデレート",
  minimal: "ミニマル",
  carbon: "カーボンプレート",
} as const;

export const SURFACE_TYPES = {
  road: "ロード",
  trail: "トレイル",
  track: "トラック",
} as const;

export const PRONATION_TYPES = {
  neutral: "ニュートラル",
  stability: "スタビリティ",
  motion_control: "モーションコントロール",
} as const;

export const TRAINING_TYPES = {
  dailyJog: "デイリージョグ",
  paceRun: "ペース走",
  interval: "インターバル走",
  longRun: "ロング走",
  race: "レース",
  recovery: "リカバリー",
} as const;

export const TARGET_TIME_CATEGORIES = {
  sub3: "サブ3（3時間切り）",
  sub3_5: "サブ3.5（3時間30分切り）",
  sub4: "サブ4（4時間切り）",
  sub4_5: "サブ4.5（4時間30分切り）",
  sub5: "サブ5（5時間切り）",
  finisher: "完走目標",
} as const;

export const PRICE_RANGES = [
  { label: "〜10,000円", min: 0, max: 10000 },
  { label: "10,000〜15,000円", min: 10000, max: 15000 },
  { label: "15,000〜20,000円", min: 15000, max: 20000 },
  { label: "20,000〜25,000円", min: 20000, max: 25000 },
  { label: "25,000円〜", min: 25000, max: 999999 },
] as const;

export const COMPARE_MAX_ITEMS = 4;

export const RADAR_CHART_METRICS = [
  { key: "cushion", label: "クッション", description: "衝撃吸収・快適性" },
  { key: "rebound", label: "反発性", description: "エネルギーリターン" },
  { key: "lightweight", label: "軽量性", description: "シューズの軽さ" },
  { key: "durability", label: "耐久性", description: "走行可能距離" },
  { key: "stability", label: "安定性", description: "プロネーション制御" },
] as const;
