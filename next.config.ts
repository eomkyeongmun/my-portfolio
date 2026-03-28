import type { NextConfig } from "next";
import { execSync } from "child_process";

const nextConfig: NextConfig = {
  output: "export",   // `next build` → out/ 정적 파일 생성 (S3 배포용)
  trailingSlash: true, // S3 정적 호스팅에서 /path/ → /path/index.html 매핑
  images: { unoptimized: true }, // output: export 모드에서 Image Optimization API 비활성화

  // 빌드마다 RSC 페이로드(.txt)에 고유 ID를 심어 stale 캐시를 즉시 무효화한다.
  // - Next.js가 JS의 buildId와 캐시된 RSC의 buildId 불일치를 감지하면 하드 네비게이션으로 폴백
  // - 내용이 변경되므로 aws s3 sync가 RSC 파일을 재업로드 → 새 Cache-Control 헤더 적용
  generateBuildId: async () => {
    try {
      return execSync("git rev-parse HEAD").toString().trim();
    } catch {
      return `build-${Date.now()}`;
    }
  },
};

export default nextConfig;
