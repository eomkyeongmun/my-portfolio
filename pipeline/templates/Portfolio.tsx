import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { buildStyles, SectionTitle, TagRow, Bullet, Field } from "./ui";
import { buildTheme } from "../lib/theme";
import { getLabels } from "../lib/labels";
import type { CompanyConfig, Lang } from "../lib/types";
import type { PortfolioData } from "../lib/data";

interface Props {
  data: PortfolioData;
  company: CompanyConfig;
  lang: Lang;
}

/**
 * 포트폴리오 = 프로젝트 심층. 프로젝트 1개당 1페이지 시작(break).
 * Overview / Architecture / Tech Stack / Problem Solving / Retrospective + 연구(논문).
 */
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
        {/* Cover header */}
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
        <Text style={[s.muted, { marginTop: 4 }]}>{p.summary}</Text>

        {/* Projects */}
        {data.projects.map((proj, i) => (
          <View key={i} break={i > 0} style={{ marginTop: 14 }}>
            <View style={s.rowBaseline}>
              <Text style={s.projectTitle}>{proj.title}</Text>
              <Text style={s.period}>{proj.period}</Text>
            </View>
            <Text style={s.projectMeta}>
              {proj.category.toUpperCase()}
              {proj.confidential ? `   ·   ${L.privateProject}` : ""}
            </Text>

            <View style={{ marginTop: 6 }}>
              <Text>{proj.overview.description}</Text>
              <Text style={[s.muted, { marginTop: 2 }]}>
                <Text style={s.bold}>{L.role}</Text>  {proj.overview.role}
              </Text>
            </View>

            {/* Architecture */}
            <SectionTitle s={s}>{L.architecture}</SectionTitle>
            <Text>{proj.architecture.description}</Text>
            {proj.architecture.reasoning && (
              <Field s={s} label={lang === "en" ? "Design rationale" : "설계 근거"}>
                {proj.architecture.reasoning}
              </Field>
            )}

            {/* Tech Stack */}
            <SectionTitle s={s}>{L.techStack}</SectionTitle>
            {proj.techStack.map((t, j) => (
              <View key={j} style={{ marginBottom: 3 }}>
                <Text>
                  <Text style={s.bold}>{t.name}</Text>
                  <Text style={s.faint}>{`   ${t.role}`}</Text>
                </Text>
                <Text style={s.muted}>{t.reason}</Text>
              </View>
            ))}

            {/* Problem Solving */}
            <SectionTitle s={s}>{lang === "en" ? "Problem Solving" : "문제 해결"}</SectionTitle>
            {proj.problemSolving.map((ps, j) => (
              <View key={j} style={{ marginBottom: 6 }}>
                <Field s={s} label={L.issue}>{ps.issue}</Field>
                <Field s={s} label={L.analysis}>{ps.analysis}</Field>
                <Field s={s} label={L.solution}>{ps.solution}</Field>
                <Field s={s} label={L.result}>{ps.result}</Field>
              </View>
            ))}

            {/* Retrospective */}
            <SectionTitle s={s}>{L.retrospective}</SectionTitle>
            <Field s={s} label={L.improvements}>{proj.retrospective.improvements}</Field>
            <Field s={s} label={L.regrets}>{proj.retrospective.regrets}</Field>
            <Field s={s} label={L.futureWork}>{proj.retrospective.futureWork}</Field>
          </View>
        ))}

        {/* Research / Paper */}
        {paper && (
          <View break style={{ marginTop: 14 }}>
            <Text style={s.projectTitle}>{paper.title}</Text>
            <Text style={s.projectMeta}>{L.research}</Text>
            <Text style={{ marginTop: 6 }}>{paper.summary}</Text>
            {paper.keywords && paper.keywords.length > 0 && (
              <TagRow s={s} items={paper.keywords} />
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
