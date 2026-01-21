"use client";
import { ClassNameValue } from "tailwind-merge";
import { Portal } from "../portal";
import { Children, useState } from "react";
import { CreateAgenda } from "./createAgenda";
import { useAgendas } from "@/lib/zustand";
import { useRouter } from "next/navigation";

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

  const route = useRouter();

  return (
    <div
      className={`hidden md:flex ${className} md:gap-x-1 items-center justify-center`}
    >
      <Portal onOpen={onCreate}>
        <CreateAgenda
          onClick={() => setOnCreate(!onCreate)}
          onCreate={onCreate}
        />
      </Portal>

      <ItemTopbar onClick={() => route.push("/kelola")}>
        Kelola Agenda
      </ItemTopbar>
      <ItemTopbar>Approval Box</ItemTopbar>
      <ItemTopbar onClick={() => setOnCreate(!onCreate)}>
        Bikin Acara
      </ItemTopbar>
      <ItemTopbar onClick={() => route.push("/profil")}>Profile</ItemTopbar>
      <ItemTopbar>Logout</ItemTopbar>
      <ItemTopbar>Login</ItemTopbar>
    </div>
  );
};

export const ItemsMenu = () => {
  const onCreate = useAgendas((state) => state.onCreate);
  const setOnCreate = useAgendas((state) => state.setOnCreate);

  const route = useRouter();

  return (
    <div className="w-full flex items-start justify-center flex-col">
      <ItemMenu onClick={() => route.push("/profil")}>Profile</ItemMenu>
      <ItemMenu onClick={() => setOnCreate(!onCreate)}>Bikin Acara</ItemMenu>
      <ItemMenu onClick={() => route.push("/kelola")}>Kelola Agenda</ItemMenu>
      <ItemMenu>Approval Box</ItemMenu>
      <ItemMenu>Login</ItemMenu>
      <ItemMenu>Logout</ItemMenu>
    </div>
  );
};
