export interface Certification {
  name: string;
  issuer: string;
  date: string;           // 예: "2025.03"
  certNumber?: string;    // 자격증 번호 (예: "ADsP-2025-XXXXX")
}

export const certifications: Certification[] = [
  {
    name: "데이터분석 준전문가 (ADsP)",
    issuer: "한국데이터산업진흥원",
    date: "2025.03",
    certNumber: "", // TODO: 자격증 번호 입력
  },
  {
    name: "리눅스마스터 2급",
    issuer: "한국정보통신진흥협회 (KAIT)",
    date: "2025.10",
    certNumber: "", // TODO: 자격증 번호 입력
  },
  {
    name: "SQL 개발자 (SQLD)",
    issuer: "한국데이터산업진흥원",
    date: "2025.12",
    certNumber: "", // TODO: 자격증 번호 입력
  },
  {
    name: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    date: "2026.03",
    certNumber: "", // TODO: 자격증 번호 입력
  },
];
