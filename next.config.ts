import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",   // `next build` → out/ 정적 파일 생성 (S3 배포용)
  trailingSlash: true, // S3 정적 호스팅에서 /path/ → /path/index.html 매핑
};

export default nextConfig;
