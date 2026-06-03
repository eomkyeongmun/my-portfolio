import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { buildStyles, SectionTitle, TagRow, Bullet } from "./ui";
import { buildTheme } from "../lib/theme";
import { getLabels, militaryStatus } from "../lib/labels";
import type { CompanyConfig, Lang } from "../lib/types";
import type { PortfolioData } from "../lib/data";

interface Props {
  data: PortfolioData;
  company: CompanyConfig;
  lang: Lang;
}

/**
 * 이력서 = 요약 1~2장. 정량 성과 + 기술 스택 중심.
 * 프로젝트는 한 줄 요약 + 핵심 기술 태그만 (심층 내용은 포폴로).
 */
export function ResumeDoc({ data, company, lang }: Props) {
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

  const contact = [p.links.email, p.links.phone, p.links.github, p.links.blog]
    .filter(Boolean)
    .join("   ·   ");

  return (
    <Document author={p.name} title={`${p.name} ${L.resumeTitle}`}>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.rowBetween}>
          <View>
            <Text style={s.name}>{p.name}</Text>
            <Text style={s.role}>{role}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.docKind}>{L.resumeTitle}</Text>
            {target && (
              <Text style={s.target}>{lang === "en" ? `for ${target}` : `${target} 지원`}</Text>
            )}
          </View>
        </View>
        <Text style={s.contact}>{contact}</Text>
        <View style={s.headerRule} />

        {/* Summary */}
        <View style={s.section}>
          <SectionTitle s={s}>{L.summary}</SectionTitle>
          <Text>{p.summary}</Text>
        </View>

        {/* Education */}
        <View style={s.section}>
          <SectionTitle s={s}>{L.education}</SectionTitle>
          <View style={s.rowBaseline}>
            <Text>
              <Text style={s.bold}>{p.education.school}</Text>  ·  {p.education.major}
            </Text>
            {p.education.period && <Text style={s.period}>{p.education.period}</Text>}
          </View>
          <Text style={s.muted}>
            {L.gpa} {p.education.gpa}   ·   {L.majorGpa} {p.education.majorGpa}
          </Text>
        </View>

        {/* Experience */}
        {p.experience && p.experience.length > 0 && (
          <View style={s.section}>
            <SectionTitle s={s}>{L.experience}</SectionTitle>
            {p.experience.map((exp, i) => (
              <View key={i} style={s.block}>
                <View style={s.rowBaseline}>
                  <Text>
                    <Text style={s.bold}>{exp.company}</Text>
                    {exp.role ? `  ·  ${exp.role}` : ""}
                  </Text>
                  <Text style={s.period}>{exp.period}</Text>
                </View>
                {exp.description.map((d, j) => (
                  <Bullet key={j} s={s}>{d}</Bullet>
                ))}
                {exp.paper && (
                  <Text style={[s.muted, { marginTop: 2 }]}>
                    <Text style={s.bold}>{lang === "en" ? "Paper" : "논문"}</Text>
                    {`  ${exp.paper.title}`}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills (tech stack emphasis) */}
        <View style={s.section}>
          <SectionTitle s={s}>{L.skills}</SectionTitle>
          {data.skills.map((cat, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 2 }}>
              <Text style={[s.bold, { width: 110 }]}>{cat.category}</Text>
              <Text style={{ flex: 1 }}>{cat.items.map((it) => it.name).join("  ·  ")}</Text>
            </View>
          ))}
        </View>

        {/* Key Highlights (quantitative) */}
        {data.highlights.length > 0 && (
          <View style={s.section}>
            <SectionTitle s={s}>{L.highlights}</SectionTitle>
            {data.highlights.map((h, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <Text style={s.bold}>{h.title}</Text>
                <Text style={s.muted}>{h.result}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects (brief) */}
        <View style={s.section}>
          <SectionTitle s={s}>{L.projects}</SectionTitle>
          {data.projects.map((proj, i) => (
            <View key={i} style={s.block}>
              <View style={s.rowBaseline}>
                <Text style={s.bold}>{proj.title}</Text>
                <Text style={s.period}>{proj.period}</Text>
              </View>
              <Text style={s.muted}>{proj.overview.description}</Text>
              <TagRow s={s} items={proj.techStack.slice(0, 6).map((t) => t.name)} />
            </View>
          ))}
        </View>

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <View style={s.section}>
            <SectionTitle s={s}>{L.certifications}</SectionTitle>
            {data.certifications.map((c, i) => (
              <View key={i} style={s.rowBaseline}>
                <Text>
                  <Text style={s.bold}>{c.name}</Text>  ·  {c.issuer}
                </Text>
                <Text style={s.period}>{c.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Military + Activities */}
        <View style={s.section}>
          <SectionTitle s={s}>{L.activities}</SectionTitle>
          {p.militaryService && (
            <View style={s.rowBaseline}>
              <Text>
                <Text style={s.bold}>{L.military}</Text>  ·  {p.militaryService.branch}  ·{" "}
                {militaryStatus(p.militaryService.status, lang)}
              </Text>
              <Text style={s.period}>{p.militaryService.period}</Text>
            </View>
          )}
          {p.bootcamp?.map((b, i) => (
            <View key={`b${i}`} style={s.rowBaseline}>
              <Text>
                <Text style={s.bold}>{b.name}</Text>  ·  {b.organizer}
              </Text>
              <Text style={s.period}>{b.period}</Text>
            </View>
          ))}
          {p.clubs?.map((c, i) => (
            <View key={`c${i}`} style={s.rowBaseline}>
              <Text>{c.name}</Text>
              <Text style={s.period}>{c.period}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
