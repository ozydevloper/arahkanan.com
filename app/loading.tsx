"use client";

import LogoApp from "@/components/core-ui-new/logo-app";

export default function Loading() {
  return (
    <div className="w-full h-dvh bg-primary-foreground flex items-center justify-center text-center">
      <LogoApp className="animate-pulse" />
    </div>
  );
}
