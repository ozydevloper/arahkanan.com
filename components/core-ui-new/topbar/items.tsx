"use client";
import { ClassNameValue } from "tailwind-merge";
import { useAgendas, useUserSession } from "@/lib/zustand";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

const ItemTopbar = ({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  className?: ClassNameValue;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2.5 rounded-2xl text-xs font-medium hover:bg-primary/20 transition-colors ease-in-out duration-200 ${className} cursor-pointer`}
    >
      {children}
    </div>
  );
};

const ItemMenu = ({
  children,
  onClick,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      className="w-full p-2 border-b transition-colors ease-in-out duration-200 active:bg-blue-50 active:text-primary rounded-xl "
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const ItemsTopBar = ({ className }: { className: ClassNameValue }) => {
  const onCreate = useAgendas((state) => state.onCreate);
  const setOnCreate = useAgendas((state) => state.setOnCreate);

  const onPublishing = useAgendas((state) => state.onPublishing);
  const setOnPublishing = useAgendas((state) => state.setOnPublishing);

  const session = useUserSession((state) => state.dataUser);

  const route = useRouter();

  return (
    <div
      className={`hidden md:flex ${className} md:gap-x-1 items-center justify-center`}
    >
      {session && session.role === "SUDO" && (
        <>
          <ItemTopbar onClick={() => route.push("/kelola")}>
            Kelola Agenda
          </ItemTopbar>
          <ItemTopbar onClick={() => setOnPublishing(!onPublishing)}>
            Publishing
          </ItemTopbar>
        </>
      )}
      {session && (session.role === "SUPERUSER" || session.role === "SUDO") && (
        <>
          <ItemTopbar
            onClick={() => {
              if (!!!session) {
                return;
              }
              setOnCreate(!onCreate);
            }}
          >
            Bikin Acara
          </ItemTopbar>
        </>
      )}

      {session && (
        <>
          <ItemTopbar onClick={() => signOut()}>Logout</ItemTopbar>
        </>
      )}

      {!session && (
        <ItemTopbar onClick={() => signIn("google")}>Login</ItemTopbar>
      )}
    </div>
  );
};

export const ItemsMenu = () => {
  const onCreate = useAgendas((state) => state.onCreate);
  const setOnCreate = useAgendas((state) => state.setOnCreate);
  const onPublishing = useAgendas((state) => state.onPublishing);
  const setOnPublishing = useAgendas((state) => state.setOnPublishing);

  const session = useUserSession((state) => state.dataUser);

  const route = useRouter();

  return (
    <div className="w-full flex items-start justify-center flex-col">
      {session && session.role === "SUDO" && (
        <>
          <ItemMenu onClick={() => route.push("/kelola")}>
            Kelola Agenda
          </ItemMenu>
          <ItemMenu onClick={() => setOnPublishing(!onPublishing)}>
            Publishing
          </ItemMenu>
        </>
      )}
      {session && (session.role === "SUDO" || session.role === "SUPERUSER") && (
        <>
          <ItemMenu
            onClick={() => {
              if (!!!session) {
                return;
              }
              setOnCreate(!onCreate);
            }}
          >
            Bikin Acara
          </ItemMenu>
        </>
      )}
      {!session && <ItemMenu onClick={() => signIn("google")}>Login</ItemMenu>}
      {session && <ItemMenu onClick={() => signOut()}>Logout</ItemMenu>}
    </div>
  );
};
