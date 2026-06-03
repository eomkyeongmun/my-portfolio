import type { CompanyConfig } from "../lib/types";
import { defaultCompany } from "./default";

/**
 * 기업 레지스트리.
 * 지원할 때마다 _example.ts 를 복사해 pipeline/companies/<id>.ts 를 만들고
 * 아래에 import + 등록만 하면 된다. (기업명은 그때그때 채운다)
 *
 *   import { toss } from "./toss";
 *   export const companies = { default: defaultCompany, toss };
 */
export const companies: Record<string, CompanyConfig> = {
  default: defaultCompany,
};

export function getCompany(id: string): CompanyConfig {
  return companies[id] ?? companies.default;
}
