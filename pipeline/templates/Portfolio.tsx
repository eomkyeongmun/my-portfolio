import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { buildStyles, SectionTitle, TagRow, Field } from "./ui";
import { buildTheme } from "../lib/theme";
import { getLabels } from "../lib/labels";
import type { CompanyConfig, Lang } from "../lib/types";
import type { PortfolioData } from "../lib/data";

interface Props {
  data: PortfolioData;
  company: CompanyConfig;
  lang: Lang;
}

export function PortfolioDoc({ data, company, lang }: Props) {
  const theme = buildTheme(company.accent);
  const s = buildStyles(theme);
  const L = getLabels(lang);
  const p = data.profile;

  const role = lang === "en" ? company.roleEn ?? company.role : company.role;
  const target =
    company.id !== "default"
      ? lang === "en"
        ? company.displayNameEn ?? company.displayName
        : company.displayName
      : null;

  const paper = p.experience?.find((e) => e.paper)?.paper;

  return (
    <Document author={p.name} title={`${p.name} ${L.portfolioTitle}`}>
      <Page size="A4" style={s.page} wrap>

        {/* ── Cover header ────────────────────────────── */}
        <View style={s.rowBetween}>
          <View>
            <Text style={s.name}>{p.name}</Text>
            <Text style={s.role}>{role}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.docKind}>{L.portfolioTitle}</Text>
            {target && (
              <Text style={s.target}>{lang === "en" ? `for ${target}` : `${target} 지원`}</Text>
            )}
          </View>
        </View>
        <View style={s.headerRule} />

        <SectionTitle s={s}>about</SectionTitle>
        <View style={s.borderedBlock}>
          <Text style={{ lineHeight: 1.7 }}>{p.summary}</Text>
        </View>

        {/* ── Projects ────────────────────────────────── */}
        {data.projects.map((proj, i) => (
          <View key={i} break={i > 0} style={{ marginTop: i === 0 ? 10 : 0 }}>

            {/* Project header */}
            <View style={{ marginBottom: 6 }}>
              <Text style={[s.faint, { textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2 }]}>
                {proj.category} project
              </Text>
              <View style={s.rowBaseline}>
                <Text style={s.projectTitle}>{proj.title}</Text>
                <Text style={s.period}>{proj.period}</Text>
              </View>
              {proj.confidential && (
                <Text style={[s.faint, { marginTop: 1 }]}>{L.privateProject}</Text>
              )}
            </View>

            <View style={s.headerRule} />

            {/* Overview */}
            <SectionTitle s={s}>{lang === "en" ? "overview" : "개요"}</SectionTitle>
            <View style={s.borderedBlock}>
              <Text>{proj.overview.description}</Text>
              <Text style={[s.muted, { marginTop: 3 }]}>
                <Text style={s.bold}>{L.role}: </Text>
                {proj.overview.role}
              </Text>
            </View>

            {/* Architecture */}
            <SectionTitle s={s}>{L.architecture}</SectionTitle>
            <View style={s.borderedBlock}>
              <Text>{proj.architecture.description}</Text>
              {proj.architecture.reasoning && (
                <View style={[s.card, { marginTop: 6 }]}>
                  <Text style={s.cardLabel}>{lang === "en" ? "design rationale" : "설계 근거"}</Text>
                  <Text style={s.body}>{proj.architecture.reasoning}</Text>
                </View>
              )}
            </View>

            {/* Tech Stack */}
            <SectionTitle s={s}>{L.techStack}</SectionTitle>
            <View style={s.borderedBlock}>
              {proj.techStack.map((t, j) => (
                <View key={j} style={{ flexDirection: "row", marginBottom: 4, gap: 8 }}>
                  <Text style={[s.bold, { width: 100, fontSize: 8.5 }]}>{t.name}</Text>
                  <Text style={[s.faint, { width: 120 }]}>{t.role}</Text>
                  <Text style={[s.muted, { flex: 1 }]}>{t.reason}</Text>
                </View>
              ))}
            </View>

            {/* Problem Solving */}
            <SectionTitle s={s}>{lang === "en" ? "problem solving" : "문제 해결"}</SectionTitle>
            <View style={s.borderedBlock}>
              {proj.problemSolving.map((ps, j) => (
                <View key={j} style={[s.card, { marginBottom: 5 }]}>
                  <View style={{ marginBottom: 3 }}>
                    <View style={s.highlightDl}>
                      <Text style={s.highlightDt}>{L.issue}</Text>
                      <Text style={s.highlightDd}>{ps.issue}</Text>
                    </View>
                    <View style={s.highlightDl}>
                      <Text style={s.highlightDt}>{L.analysis}</Text>
                      <Text style={s.highlightDd}>{ps.analysis}</Text>
                    </View>
                    <View style={s.highlightDl}>
                      <Text style={s.highlightDt}>{L.solution}</Text>
                      <Text style={s.highlightDd}>{ps.solution}</Text>
                    </View>
                    <View style={s.highlightDl}>
                      <Text style={[s.highlightDt]}>{L.result}</Text>
                      <Text style={[s.highlightDd, { fontWeight: 700, color: theme.heading }]}>{ps.result}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Retrospective */}
            <SectionTitle s={s}>{L.retrospective}</SectionTitle>
            <View style={s.borderedBlock}>
              <View style={s.highlightDl}>
                <Text style={[s.highlightDt, { width: 48 }]}>{L.improvements}</Text>
                <Text style={s.highlightDd}>{proj.retrospective.improvements}</Text>
              </View>
              <View style={s.highlightDl}>
                <Text style={[s.highlightDt, { width: 48 }]}>{L.regrets}</Text>
                <Text style={s.highlightDd}>{proj.retrospective.regrets}</Text>
              </View>
              <View style={s.highlightDl}>
                <Text style={[s.highlightDt, { width: 48 }]}>{L.futureWork}</Text>
                <Text style={s.highlightDd}>{proj.retrospective.futureWork}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* ── Research / Paper ─────────────────────────── */}
        {paper && (
          <View break>
            <Text style={[s.faint, { textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2 }]}>
              research
            </Text>
            <Text style={s.projectTitle}>{paper.title}</Text>
            <View style={s.headerRule} />
            <SectionTitle s={s}>{L.research}</SectionTitle>
            <View style={s.borderedBlock}>
              <Text style={{ lineHeight: 1.7 }}>{paper.summary}</Text>
              {paper.keywords && paper.keywords.length > 0 && (
                <TagRow s={s} items={paper.keywords} />
              )}
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
}
