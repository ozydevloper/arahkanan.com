"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const Portal = ({
  children,
  onOpen,
  show,
}: {
  children: React.ReactNode;
  onOpen: boolean;
  show?: "right" | "top";
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [portalRoot, setPortalRoot] = useState<null | HTMLElement>(null);

  useEffect(() => {
    function setMount() {
      setMounted(true);
    }
    setMount();
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    function setRoot() {
      setPortalRoot(document.getElementById("portal-root"));
    }
    setRoot();
  }, []);

  useEffect(() => {
    if (onOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [onOpen]);

  if (!mounted) return null;
  if (!portalRoot) return null;

  return createPortal(
    <div
      className={`w-full h-dvh fixed inset-0 bg-black/50 z-10 flex justify-center transition-all ease-in-out duration-200 overflow-y-auto  ${show === "right" ? (onOpen ? "translate-x-0" : "translate-x-full") : show === "top" ? (onOpen ? "translate-y-0" : "-translate-y-full") : onOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
    >
      {children}
    </div>,
    portalRoot,
  );
};
