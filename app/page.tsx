"use client";
import TopBar from "@/components/core-ui-new/topbar/topbar";
import { Landing } from "@/components/core-ui-new/landing/landing";
import { Content } from "@/components/core-ui-new/content/content";
import LogoApp from "@/components/core-ui-new/logo-app";

export default function Home() {
  return (
    <div className="w-full h-dvh max-h-dvh bg-primary-foreground">
      <TopBar />
      <div className="w-full flex flex-col items-center jusitfy-start px-2">
        <Landing />
        <Content />
      </div>
      <div className="w-full bg-black h-15 flex items-center justify-center flex-col">
        <LogoApp />
        <span className="text-xs text-white">
          Kontak (Instagram): @arahkanan_official
        </span>
      </div>
    </div>
  );
}
