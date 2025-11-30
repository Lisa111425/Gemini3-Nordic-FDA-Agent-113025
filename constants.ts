import { FlowerTheme, ModelProvider, AgentConfig } from './types';

export const AI_MODELS = {
  [ModelProvider.GEMINI]: [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
  ],
  [ModelProvider.OPENAI]: [
    "gpt-4o-mini",
    "gpt-4.1-mini",
    "gpt-5-nano",
  ],
  [ModelProvider.ANTHROPIC]: [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022",
  ],
  [ModelProvider.XAI]: [
    "grok-beta",
  ]
};

export const FLOWER_THEMES: FlowerTheme[] = [
  { id: "nordic_lotus", nameEn: "Nordic Lotus", nameZh: "北境蓮華", primary: "#7FB3D5", secondary: "#F5CBA7", accent: "#82E0AA", bgLight: "#F4F6F7", bgDark: "#1A2530" },
  { id: "polar_rose", nameEn: "Polar Rose", nameZh: "極地玫瑰", primary: "#EC7063", secondary: "#FADBD8", accent: "#AF7AC5", bgLight: "#FDFEFE", bgDark: "#2C1E20" },
  { id: "glacier_lily", nameEn: "Glacier Lily", nameZh: "冰川百合", primary: "#5DADE2", secondary: "#D6EAF8", accent: "#F4D03F", bgLight: "#EBF5FB", bgDark: "#15202B" },
  { id: "midnight_orchid", nameEn: "Midnight Orchid", nameZh: "午夜蘭花", primary: "#8E44AD", secondary: "#D2B4DE", accent: "#F1C40F", bgLight: "#F5EEF8", bgDark: "#1F1528" },
  { id: "aurora_tulip", nameEn: "Aurora Tulip", nameZh: "極光鬱金香", primary: "#48C9B0", secondary: "#A3E4D7", accent: "#E67E22", bgLight: "#E8F8F5", bgDark: "#0E2824" },
  { id: "frost_cherry", nameEn: "Frost Cherry", nameZh: "霜櫻", primary: "#F1948A", secondary: "#F9E79F", accent: "#58D68D", bgLight: "#FEF9E7", bgDark: "#281818" },
  { id: "viking_violet", nameEn: "Viking Violet", nameZh: "維京紫羅蘭", primary: "#A569BD", secondary: "#EBDEF0", accent: "#5D6D7E", bgLight: "#F4ECF7", bgDark: "#211826" },
  { id: "arctic_poppy", nameEn: "Arctic Poppy", nameZh: "北極罌粟", primary: "#E74C3C", secondary: "#Fdedec", accent: "#F39C12", bgLight: "#FDEDEC", bgDark: "#2B1615" },
  { id: "snow_drop", nameEn: "Snow Drop", nameZh: "雪花蓮", primary: "#BDC3C7", secondary: "#ECF0F1", accent: "#2ECC71", bgLight: "#FFFFFF", bgDark: "#17202A" },
  { id: "fjord_iris", nameEn: "Fjord Iris", nameZh: "峽灣鳶尾", primary: "#2980B9", secondary: "#A9CCE3", accent: "#F5B041", bgLight: "#EAF2F8", bgDark: "#102433" },
  { id: "scandi_sunflower", nameEn: "Scandi Sunflower", nameZh: "斯堪地向日葵", primary: "#F39C12", secondary: "#F9E79F", accent: "#27AE60", bgLight: "#FEF9E7", bgDark: "#292108" },
  { id: "misty_lavender", nameEn: "Misty Lavender", nameZh: "迷霧薰衣草", primary: "#9B59B6", secondary: "#E8DAEF", accent: "#1ABC9C", bgLight: "#F4ECF7", bgDark: "#1D1623" },
  { id: "obsidian_dahlia", nameEn: "Obsidian Dahlia", nameZh: "黑曜石大麗花", primary: "#34495E", secondary: "#85929E", accent: "#C0392B", bgLight: "#EBEDEF", bgDark: "#050505" },
  { id: "crystal_jasmine", nameEn: "Crystal Jasmine", nameZh: "水晶茉莉", primary: "#1ABC9C", secondary: "#A3E4D7", accent: "#F1C40F", bgLight: "#E8F8F5", bgDark: "#0B2620" },
  { id: "ember_marigold", nameEn: "Ember Marigold", nameZh: "餘燼萬壽菊", primary: "#D35400", secondary: "#F6DDCC", accent: "#F7DC6F", bgLight: "#FBEEE6", bgDark: "#2E1505" },
  { id: "baltic_bluebell", nameEn: "Baltic Bluebell", nameZh: "波羅的海藍鈴", primary: "#3498DB", secondary: "#AED6F1", accent: "#9B59B6", bgLight: "#EBF5FB", bgDark: "#0E1F2E" },
  { id: "rune_hibiscus", nameEn: "Rune Hibiscus", nameZh: "符文木槿", primary: "#C0392B", secondary: "#F2D7D5", accent: "#8E44AD", bgLight: "#FDEDEC", bgDark: "#260C0A" },
  { id: "shield_peony", nameEn: "Shield Peony", nameZh: "盾芍藥", primary: "#E59866", secondary: "#FDCFE8", accent: "#52BE80", bgLight: "#FDF2E9", bgDark: "#29160B" },
  { id: "twilight_magnolia", nameEn: "Twilight Magnolia", nameZh: "暮光木蘭", primary: "#AF7AC5", secondary: "#E8DAEF", accent: "#5499C7", bgLight: "#F5EEF8", bgDark: "#1A1021" },
  { id: "winter_camellia", nameEn: "Winter Camellia", nameZh: "冬山茶", primary: "#EC7063", secondary: "#D7BDE2", accent: "#48C9B0", bgLight: "#FDEDEC", bgDark: "#2B161A" },
];

export const INITIAL_AGENTS: AgentConfig[] = [
  {
    id: "analyst",
    name: "Regulatory Analyst",
    description: "Analyzes input for compliance gaps.",
    model: "gemini-2.5-flash",
    maxTokens: 4000,
    temperature: 0.2,
    systemPrompt: "You are an expert FDA regulatory analyst. Analyze the provided device description and identify potential predicate device gaps.",
    provider: ModelProvider.GEMINI
  },
  {
    id: "writer",
    name: "Submission Writer",
    description: "Drafts the 510(k) summary.",
    model: "gpt-4o-mini",
    maxTokens: 6000,
    temperature: 0.7,
    systemPrompt: "You are a technical writer specializing in medical devices. Draft a clear, concise 510(k) summary based on the analysis.",
    provider: ModelProvider.OPENAI
  }
];

export const FOLLOW_UP_QUESTIONS = [
  "How does the chosen predicate device compare in terms of material safety?",
  "Are there any biocompatibility standards that need specific attention?",
  "What specific software verification tests are recommended?",
  "Does the device require clinical data or just bench testing?",
  "How should the sterilization validation be documented?",
  "What are the labeling requirements for this specific classification?",
  "Are there any cybersecurity concerns for this device?",
  "How does the risk management file align with ISO 14971?",
  "What is the substantial equivalence argument structure?",
  "Are there recent guidance documents relevant to this device type?",
  "How should human factors engineering be addressed?",
  "What specific shelf-life testing protocols are needed?",
  "Does the device contain any animal-derived materials?",
  "How are electromagnetic compatibility (EMC) risks mitigated?",
  "What are the specific packaging validation requirements?",
  "Is a pre-submission meeting with the FDA recommended?",
  "How should post-market surveillance be planned?",
  "Are there any unique unique device identification (UDI) requirements?",
  "How to address differences in technological characteristics?",
  "What statistical methods are appropriate for the non-clinical data?"
];