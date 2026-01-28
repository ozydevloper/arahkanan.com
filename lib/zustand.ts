import { Prisma } from "@/app/generated/prisma/client";
import { User } from "next-auth";
import { create } from "zustand";

type AgendaType = {
  agendas: Prisma.AgendaGetPayload<{ include: { user_relation: true } }>[];
  setAgendas: (
    agendas: Prisma.AgendaGetPayload<{ include: { user_relation: true } }>[],
  ) => void;

  focusTab: string;
  setFocusTab: (type: string) => void;

  onDetail: Prisma.AgendaGetPayload<{
    include: { user_relation: true };
  }> | null;
  setOnDetail: (
    agenda: Prisma.AgendaGetPayload<{
      include: { user_relation: true };
    }> | null,
  ) => void;

  onCreate: boolean;
  setOnCreate: (onCreate: boolean) => void;

  onUpdate: null | Prisma.AgendaGetPayload<{
    include: { user_relation: true };
  }>;
  setOnUpadate: (
    agenda: null | Prisma.AgendaGetPayload<{
      include: { user_relation: true };
    }>,
  ) => void;

  pageContent: number;
  setPageContent: (page: number) => void;

  onDelete: null | Prisma.AgendaGetPayload<{
    include: { user_relation: true };
  }>;
  setOnDelete: (
    agenda: Prisma.AgendaGetPayload<{
      include: { user_relation: true };
    }> | null,
  ) => void;

  onPublishing: boolean;
  setOnPublishing: (state: boolean) => void;
};

export const useAgendas = create<AgendaType>((set) => ({
  agendas: [],
  setAgendas: (
    agendas: Prisma.AgendaGetPayload<{ include: { user_relation: true } }>[],
  ) =>
    set({
      agendas: agendas,
    }),

  focusTab: "Hari Ini",
  setFocusTab: (focusTab: string) => set({ focusTab: focusTab }),

  onDetail: null,
  setOnDetail: (
    agenda: Prisma.AgendaGetPayload<{
      include: { user_relation: true };
    }> | null,
  ) => set({ onDetail: agenda }),

  onCreate: false,
  setOnCreate: (onCreate: boolean) => set({ onCreate: onCreate }),

  pageContent: 1,
  setPageContent: (page: number) => set({ pageContent: page }),

  onDelete: null,
  setOnDelete: (
    agenda: Prisma.AgendaGetPayload<{
      include: { user_relation: true };
    }> | null,
  ) => set({ onDelete: agenda }),

  onUpdate: null,
  setOnUpadate: (
    agenda: null | Prisma.AgendaGetPayload<{
      include: { user_relation: true };
    }>,
  ) => set({ onUpdate: agenda }),

  onPublishing: false,
  setOnPublishing: (state) => set({ onPublishing: state }),
}));

type UserType = {
  dataUser: User | null;
  setDataUser: (dataUser: User | null) => void;

  updateUser: null | Prisma.UserGetPayload<object>;
  setUpdateUser: (user: null | Prisma.UserGetPayload<object>) => void;
};

export const useUserSession = create<UserType>((set) => ({
  dataUser: null,
  setDataUser: (dataUser: User | null) => set({ dataUser: dataUser }),

  updateUser: null,
  setUpdateUser: (user: null | Prisma.UserGetPayload<object>) =>
    set({ updateUser: user }),
}));
