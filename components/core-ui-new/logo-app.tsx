"use client";
import { useRouter } from "next/navigation";
import { ClassNameValue } from "tailwind-merge";

const LogoApp = ({ className }: { className?: ClassNameValue }) => {
  const route = useRouter();
  return (
    <div
      onClick={() => route.push("/")}
      className={`text-sm font-extrabold text-primary ${className}`}
    >
      arahkanan.com
    </div>
  );
};
export default LogoApp;
