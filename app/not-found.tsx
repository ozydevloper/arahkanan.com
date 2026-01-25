"use client";
import LogoApp from "@/components/core-ui-new/logo-app";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="w-full h-dvh flex items-center justify-center flex-col gap-y-2">
      <LogoApp />
      <span className="text-sm">
        Halaman tidak ditemukan{" "}
        <span className="text-primary" onClick={() => router.push("/")}>
          kembali
        </span>
      </span>
    </div>
  );
}
