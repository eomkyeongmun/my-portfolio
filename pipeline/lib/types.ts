export type Lang = "ko" | "en";
export type DocType = "resume" | "portfolio";

/**
 * 기업별로 바뀌는 "특징"만 정의한다.
 * 전체 이력서/포폴 내용은 src/data 를 공유하고, 여기서 지정한 직무·색상만 덮어쓴다.
 */
export interface CompanyConfig {
  /** 출력 파일명·CLI 식별자 (예: "toss") */
  id: string;
  /** 표지·헤더 표시명 (한글) */
  displayName: string;
  /** 표지·헤더 표시명 (영문, 없으면 displayName 사용) */
  displayNameEn?: string;
  /** 지원 직무/포지션 — 헤더 타이틀로 사용 (한글) */
  role: string;
  /** 지원 직무/포지션 (영문, 없으면 role 사용) */
  roleEn?: string;
  /** 브랜드 강조색 hex (예: 삼성 "#1428A0", LG "#A50034") */
  accent: string;
}
