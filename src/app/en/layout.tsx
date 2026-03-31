import { LangSetter } from "@/components/LangSetter";

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LangSetter lang="en" />
      {children}
    </>
  );
}
