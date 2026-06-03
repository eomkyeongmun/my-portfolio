import React from "react";
import { StyleSheet, View, Text } from "@react-pdf/renderer";
import type { Theme } from "../lib/theme";

export function buildStyles(theme: Theme) {
  return StyleSheet.create({
    page: {
      paddingTop: 40,
      paddingBottom: 44,
      paddingHorizontal: 44,
      fontFamily: "Nanum",
      fontSize: 9.5,
      color: theme.text,
      lineHeight: 1.5,
    },
    name: { fontSize: 22, fontWeight: 700, color: theme.heading },
    role: { fontSize: 11, fontWeight: 700, color: theme.accent, marginTop: 3 },
    docKind: { fontSize: 9, fontWeight: 700, color: theme.accent, letterSpacing: 3, textTransform: "uppercase" },
    target: { fontSize: 8.5, color: theme.faint },
    contact: { fontSize: 8.5, color: theme.muted, marginTop: 6 },
    headerRule: { borderBottomWidth: 2, borderBottomColor: theme.accent, marginTop: 10, marginBottom: 2 },

    section: { marginTop: 13 },
    sectionTitle: {
      fontSize: 9,
      fontWeight: 700,
      color: theme.accent,
      letterSpacing: 1.2,
      marginBottom: 6,
      textTransform: "uppercase",
    },

    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    rowBaseline: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    block: { marginBottom: 8 },

    bold: { fontWeight: 700, color: theme.heading },
    body: { color: theme.text },
    muted: { color: theme.muted },
    faint: { color: theme.faint, fontSize: 8.5 },
    period: { fontSize: 8.5, color: theme.faint },

    label: { fontSize: 8, fontWeight: 700, color: theme.muted, marginTop: 3, marginBottom: 1 },

    tagRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
    tag: {
      fontSize: 7.5,
      color: theme.accent,
      backgroundColor: theme.accentSoft,
      borderColor: theme.accentBorder,
      borderWidth: 0.5,
      borderRadius: 3,
      paddingVertical: 1,
      paddingHorizontal: 4,
      marginRight: 4,
      marginBottom: 3,
    },

    bulletRow: { flexDirection: "row", marginBottom: 2 },
    bulletDot: { width: 9, color: theme.accent },
    bulletText: { flex: 1 },

    projectTitle: { fontSize: 13, fontWeight: 700, color: theme.heading },
    projectMeta: { fontSize: 8.5, color: theme.faint, marginTop: 1 },
  });
}

export type Styles = ReturnType<typeof buildStyles>;

export const SectionTitle = ({ s, children }: { s: Styles; children: React.ReactNode }) => (
  <Text style={s.sectionTitle}>{children}</Text>
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

/** 라벨 + 본문 한 줄 블록 (문제/분석/해결/결과 등) */
export const Field = ({ s, label, children }: { s: Styles; label: string; children: React.ReactNode }) => (
  <View>
    <Text style={s.label}>{label}</Text>
    <Text style={s.body}>{children}</Text>
  </View>
);
