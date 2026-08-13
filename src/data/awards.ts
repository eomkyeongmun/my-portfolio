export interface Award {
  name: string;           // 대회/프로그램명
  prize: string;          // 수상 내역 (예: "장려상")
  organizer: string;      // 주최
  date: string;           // 예: "2025.12"
  description?: string;   // 수상 내용
}

export const awards: Award[] = [
  {
    name: "동국 튜터링 (지산학 프로젝트 2)",
    prize: "장려상",
    organizer: "동국대학교",
    date: "2025.12",
    description: "클라우드 주제 멘토·멘티 튜터링 활동",
  },
];
