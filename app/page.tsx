"use client";
import TopBar from "@/components/core-ui-new/topbar/topbar";
import { Landing } from "@/components/core-ui-new/landing/landing";
import { Content } from "@/components/core-ui-new/content/content";

export default function Home() {
  return (
    <div className="w-full h-dvh max-h-dvh bg-primary-foreground ">
      <div className="portal"></div>
      <TopBar />
      <Landing />
      <Content />
    </div>
  );
}
