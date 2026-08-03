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

  return (
    <Document author={p.name} title={`${p.name} ${L.resumeTitle}`}>
      <Page size="A4" style={s.page}>

        {/* ── Hero ─────────────────────────────────────── */}
        <View>
          <View style={s.rowBetween}>
            <Text style={s.name}>{p.name}</Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={s.docKind}>{L.resumeTitle}</Text>
              {target && (
                <Text style={s.target}>{lang === "en" ? `for ${target}` : `${target} 지원`}</Text>
              )}
            </View>
          </View>
          <Text style={s.role}>{role}</Text>
          {p.birthdate && <Text style={s.birthdate}>{p.birthdate}</Text>}
          <View style={s.keywordRow}>
            {p.keywords.map((kw, i) => (
              <Text key={i} style={s.keyword}>{kw}</Text>
            ))}
          </View>
          <View style={s.contactRow}>
            {p.links.email && <Text style={s.contactItem}>{p.links.email}</Text>}
            {p.links.phone && <Text style={s.contactItem}>{p.links.phone}</Text>}
            {p.links.github && <Text style={s.contactItem}>{p.links.github}</Text>}
            {p.links.blog && <Text style={s.contactItem}>{p.links.blog}</Text>}
          </View>
        </View>

        <View style={s.headerRule} />

        {/* ── About ────────────────────────────────────── */}
        <SectionTitle s={s}>about</SectionTitle>
        <View style={s.borderedBlock}>
          <Text>{p.summary}</Text>
        </View>

        {/* ── Education ────────────────────────────────── */}
        <SectionTitle s={s}>education</SectionTitle>
        <View style={s.borderedBlock}>
          <View style={s.rowBetween}>
            <View>
              <Text style={s.bold}>{p.education.school}</Text>
              <Text style={[s.muted, { fontSize: 8.5, marginTop: 1 }]}>{p.education.major}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              {p.education.period && <Text style={s.period}>{p.education.period}</Text>}
              <Text style={[s.faint, { marginTop: 2 }]}>
                GPA {p.education.gpa}  ·  Major {p.education.majorGpa}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Experience ───────────────────────────────── */}
        {p.experience && p.experience.length > 0 && (
          <>
            <SectionTitle s={s}>experience</SectionTitle>
            <View style={s.borderedBlock}>
              {p.experience.map((exp, i) => (
                <View key={i} style={{ marginBottom: 4 }}>
                  <View style={s.rowBetween}>
                    <View>
                      <Text style={s.bold}>{exp.company}</Text>
                      {exp.role ? <Text style={[s.muted, { fontSize: 8.5 }]}>{exp.role}</Text> : null}
                    </View>
                    <Text style={s.period}>{exp.period}</Text>
                  </View>
                  {exp.description.map((d, j) => (
                    <Bullet key={j} s={s}>{d}</Bullet>
                  ))}
                  {exp.paper && (
                    <View style={[s.card, { marginTop: 3 }]}>
                      <Text style={s.cardLabel}>paper</Text>
                      <Text style={[s.bold, { fontSize: 8.5 }]}>{exp.paper.title}</Text>
                      {exp.paper.keywords && exp.paper.keywords.length > 0 && (
                        <TagRow s={s} items={exp.paper.keywords} />
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Bootcamp ─────────────────────────────────── */}
        {p.bootcamp && p.bootcamp.length > 0 && (
          <>
            <SectionTitle s={s}>bootcamp</SectionTitle>
            <View style={s.borderedBlock}>
              {p.bootcamp.map((b, i) => (
                <View key={i} style={[s.rowBetween, { marginBottom: 2 }]}>
                  <View>
                    <Text style={s.bold}>{b.name}</Text>
                    <Text style={[s.muted, { fontSize: 8 }]}>{b.organizer}</Text>
                  </View>
                  <Text style={s.period}>{b.period}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Skills (compact: category + names only) ─── */}
        <SectionTitle s={s}>skills</SectionTitle>
        <View style={s.borderedBlock}>
          {data.skills.map((cat, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 3, alignItems: "baseline" }}>
              <Text style={[s.bold, { width: 95, fontSize: 8.5 }]}>{cat.category}</Text>
              <Text style={[s.muted, { flex: 1, fontSize: 8.5 }]}>
                {cat.items.map((it) => it.name).join("  ·  ")}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Projects (brief) ─────────────────────────── */}
        <SectionTitle s={s}>projects</SectionTitle>
        <View style={s.borderedBlock}>
          {data.projects.map((proj, i) => (
            <View key={i} style={{ marginBottom: 5 }}>
              <View style={s.rowBaseline}>
                <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
                  <Text style={s.bold}>{proj.title}</Text>
                  <Text style={[s.tag, { fontSize: 6.5 }]}>{proj.category}</Text>
                </View>
                <Text style={s.period}>{proj.period}</Text>
              </View>
              <Text style={[s.muted, { marginTop: 1, fontSize: 8.5 }]}>{proj.overview.description}</Text>
              <TagRow s={s} items={proj.techStack.slice(0, 6).map((t) => t.name)} />
            </View>
          ))}
        </View>

        {/* ── Highlights (compact) ─────────────────────── */}
        {data.highlights.length > 0 && (
          <>
            <SectionTitle s={s}>highlights</SectionTitle>
            <View style={s.borderedBlock}>
              {data.highlights.map((h, i) => (
                <View key={i} style={{ marginBottom: 4 }}>
                  <Text style={[s.bold, { fontSize: 8.5 }]}>{h.title}</Text>
                  <Text style={[s.muted, { fontSize: 8 }]}>{h.result}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Certifications ──────────────────────────── */}
        {data.certifications.length > 0 && (
          <>
            <SectionTitle s={s}>certifications</SectionTitle>
            <View style={s.borderedBlock}>
              {data.certifications.map((c, i) => (
                <View key={i} style={[s.rowBetween, { marginBottom: 2 }]}>
                  <View>
                    <Text style={s.bold}>{c.name}</Text>
                    <Text style={[s.muted, { fontSize: 7.5 }]}>{c.issuer}</Text>
                  </View>
                  <Text style={s.period}>{c.date}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Activities ──────────────────────────────── */}
        <SectionTitle s={s}>activities</SectionTitle>
        <View style={s.borderedBlock}>
          {p.militaryService && (
            <View style={[s.rowBetween, { marginBottom: 2 }]}>
              <View>
                <Text style={s.bold}>{p.militaryService.branch}</Text>
                <Text style={[s.muted, { fontSize: 7.5 }]}>{militaryStatus(p.militaryService.status, lang)}</Text>
              </View>
              <Text style={s.period}>{p.militaryService.period}</Text>
            </View>
          )}
          {p.clubs?.map((c, i) => (
            <View key={`c${i}`} style={[s.rowBetween, { marginBottom: 1 }]}>
              <Text>{c.name}</Text>
              <Text style={s.period}>{c.period}</Text>
            </View>
          ))}
        </View>

      </Page>
    </Document>
  );
}
