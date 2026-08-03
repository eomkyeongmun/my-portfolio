import React from "react";
import { StyleSheet, View, Text } from "@react-pdf/renderer";
import type { Theme } from "../lib/theme";

export function buildStyles(theme: Theme) {
  return StyleSheet.create({
    /* ── Page ─────────────────────────────────────────── */
    page: {
      paddingTop: 36,
      paddingBottom: 40,
      paddingHorizontal: 42,
      fontFamily: "Nanum",
      fontSize: 9,
      color: theme.text,
      lineHeight: 1.45,
    },

    /* ── Header (Hero) ────────────────────────────────── */
    name: { fontSize: 26, fontWeight: 700, color: theme.heading, letterSpacing: -0.5 },
    title: { fontSize: 9, color: theme.text, marginTop: 4, lineHeight: 1.5 },
    birthdate: { fontSize: 8, color: theme.faint, marginTop: 2 },
    keywordRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 4 },
    keyword: {
      fontSize: 7.5,
      fontWeight: 700,
      color: theme.accent,
      backgroundColor: theme.accentSoft,
      borderColor: theme.accentBorder,
      borderWidth: 0.5,
      borderRadius: 3,
      paddingVertical: 2,
      paddingHorizontal: 6,
    },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 6 },
    contactItem: {
      fontSize: 8,
      color: theme.muted,
      backgroundColor: "#f9fafb",
      borderColor: theme.line,
      borderWidth: 0.5,
      borderRadius: 4,
      paddingVertical: 3,
      paddingHorizontal: 8,
    },

    /* ── Section label: // SECTION ────────────────────── */
    sectionWrap: { marginTop: 8 },
    sectionLabelRow: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
    sectionSlash: { fontSize: 8, color: theme.faint, marginRight: 3 },
    sectionLabel: {
      fontSize: 8,
      fontWeight: 700,
      color: theme.muted,
      letterSpacing: 1,
      textTransform: "uppercase",
    },

    /* ── Left accent border block ─────────────────────── */
    borderedBlock: {
      borderLeftWidth: 2,
      borderLeftColor: theme.accentSoft,
      paddingLeft: 10,
    },

    /* ── Common ───────────────────────────────────────── */
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    rowBaseline: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    block: { marginBottom: 8 },
    bold: { fontWeight: 700, color: theme.heading },
    body: { color: theme.text },
    muted: { color: theme.muted },
    faint: { color: theme.faint, fontSize: 8 },
    period: { fontSize: 8, color: theme.faint },

    /* ── Tags ─────────────────────────────────────────── */
    tagRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 3, gap: 3 },
    tag: {
      fontSize: 7,
      color: theme.accent,
      backgroundColor: theme.accentSoft,
      borderColor: theme.accentBorder,
      borderWidth: 0.5,
      borderRadius: 3,
      paddingVertical: 1,
      paddingHorizontal: 4,
    },

    /* ── Bullet ───────────────────────────────────────── */
    bulletRow: { flexDirection: "row", marginBottom: 2 },
    bulletDot: { width: 8, color: theme.faint },
    bulletText: { flex: 1 },

    /* ── Field (label + value pair) ────────────────────── */
    label: { fontSize: 7.5, fontWeight: 700, color: theme.muted, marginTop: 3, marginBottom: 1 },

    /* ── Skill stars ──────────────────────────────────── */
    skillRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 3 },
    skillName: { fontWeight: 700, color: theme.heading, width: 110, fontSize: 8.5 },
    starFilled: { fontSize: 7.5, color: theme.muted },
    starEmpty: { fontSize: 7.5, color: theme.line },
    skillDesc: { fontSize: 8, color: theme.muted, flex: 1, marginLeft: 4 },

    /* ── Project (portfolio) ──────────────────────────── */
    projectTitle: { fontSize: 14, fontWeight: 700, color: theme.heading },
    projectMeta: { fontSize: 8, color: theme.faint, marginTop: 1 },

    /* ── Card-like box ────────────────────────────────── */
    card: {
      borderWidth: 0.5,
      borderColor: theme.line,
      borderRadius: 4,
      padding: 8,
      marginBottom: 5,
      backgroundColor: "#fafafa",
    },
    cardLabel: {
      fontSize: 7,
      fontWeight: 700,
      color: theme.faint,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 2,
    },

    /* ── Highlight card ───────────────────────────────── */
    highlightTitle: { fontSize: 8.5, fontWeight: 700, color: theme.heading, marginBottom: 3 },
    highlightDl: { flexDirection: "row", marginBottom: 2 },
    highlightDt: { width: 24, fontSize: 7.5, fontWeight: 700, color: theme.heading },
    highlightDd: { flex: 1, fontSize: 7.5, color: theme.muted },

    /* ── Header rule (thin) ───────────────────────────── */
    headerRule: { borderBottomWidth: 0.5, borderBottomColor: theme.line, marginTop: 10, marginBottom: 2 },

    /* ── Doc kind badge ───────────────────────────────── */
    docKind: { fontSize: 8, fontWeight: 700, color: theme.accent },
    target: { fontSize: 8, color: theme.faint },
    role: { fontSize: 10, fontWeight: 700, color: theme.accent, marginTop: 3 },
  });
}

export type Styles = ReturnType<typeof buildStyles>;

/* ── Reusable components ──────────────────────────────── */

/** Section label: // SECTION */
export const SectionTitle = ({ s, children }: { s: Styles; children: React.ReactNode }) => (
  <View style={s.sectionWrap}>
    <View style={s.sectionLabelRow}>
      <Text style={s.sectionSlash}>{"// "}</Text>
      <Text style={s.sectionLabel}>{children}</Text>
    </View>
  </View>
);

export const Tag = ({ s, children }: { s: Styles; children: React.ReactNode }) => (
  <Text style={s.tag}>{children}</Text>
);

export const TagRow = ({ s, items }: { s: Styles; items: string[] }) => (
  <View style={s.tagRow}>
    {items.map((t, i) => (
      <Tag key={i} s={s}>{t}</Tag>
    ))}
  </View>
);

export const Bullet = ({ s, children }: { s: Styles; children: React.ReactNode }) => (
  <View style={s.bulletRow}>
    <Text style={s.bulletDot}>·</Text>
    <Text style={s.bulletText}>{children}</Text>
  </View>
);

/** Label + value field */
export const Field = ({ s, label, children }: { s: Styles; label: string; children: React.ReactNode }) => (
  <View>
    <Text style={s.label}>{label}</Text>
    <Text style={s.body}>{children}</Text>
  </View>
);

/** Skill with star rating */
export const SkillItem = ({ s, name, level, description }: { s: Styles; name: string; level: number; description: string }) => (
  <View style={s.skillRow}>
    <Text style={s.skillName}>{name}</Text>
    <Text>
      {[1, 2, 3].map((i) => (
        <Text key={i} style={i <= level ? s.starFilled : s.starEmpty}>{"★"}</Text>
      ))}
    </Text>
    <Text style={s.skillDesc}>{description}</Text>
  </View>
);
