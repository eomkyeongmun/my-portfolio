function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface Theme {
  accent: string;
  accentSoft: string;
  accentBorder: string;
  heading: string;
  text: string;
  muted: string;
  faint: string;
  line: string;
}

/** 기업 브랜드색(accent) 하나로 전체 팔레트를 만든다. */
export function buildTheme(accent: string): Theme {
  return {
    accent,
    accentSoft: rgba(accent, 0.08),
    accentBorder: rgba(accent, 0.35),
    heading: "#111827",
    text: "#1f2937",
    muted: "#4b5563",
    faint: "#9ca3af",
    line: "#e5e7eb",
  };
}
