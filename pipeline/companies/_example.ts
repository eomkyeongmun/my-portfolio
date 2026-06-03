import type { CompanyConfig } from "../lib/types";

/**
 * 복사용 템플릿. 지원할 때마다 이 파일을 복사해
 * pipeline/companies/<id>.ts 로 만들고, index.ts 에 등록한다.
 * (실제 기업 정보는 지원 시점에 채운다 — 여기엔 placeholder만 둔다.)
 */
export const example: CompanyConfig = {
  id: "example",
  displayName: "회사명",
  displayNameEn: "Company",
  role: "지원 직무 / 포지션",
  roleEn: "Target Role / Position",
  accent: "#10b981", // 브랜드 색 hex
};
