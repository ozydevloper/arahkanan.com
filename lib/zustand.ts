import { Prisma } from "@/app/generated/prisma/client";
import { create } from "zustand";

type AgendaType = {
  agendas: Prisma.AgendaGetPayload<object>[];
  setAgendas: (agendas: Prisma.AgendaGetPayload<object>[]) => void;

  focusTab: string;
  setFocusTab: (type: string) => void;

  onDetail: Prisma.AgendaGetPayload<object> | null;
  setOnDetail: (agenda: Prisma.AgendaGetPayload<object> | null) => void;

  onCreate: boolean;
  setOnCreate: (onCreate: boolean) => void;

  onUpdate: null | Prisma.AgendaGetPayload<object>;
  setOnUpadate: (agenda: null | Prisma.AgendaGetPayload<object>) => void;

  pageContent: number;
  setPageContent: (page: number) => void;

  onDelete: null | Prisma.AgendaGetPayload<object>;
  setOnDelete: (agenda: Prisma.AgendaGetPayload<object> | null) => void;
};

export const useAgendas = create<AgendaType>((set) => ({
  agendas: [],
  setAgendas: (agendas: Prisma.AgendaGetPayload<object>[]) =>
    set({
      agendas: agendas,
    }),

  focusTab: "Hari Ini",
  setFocusTab: (focusTab: string) => set({ focusTab: focusTab }),

  onDetail: null,
  setOnDetail: (agenda: Prisma.AgendaGetPayload<object> | null) =>
    set({ onDetail: agenda }),

  onCreate: false,
  setOnCreate: (onCreate: boolean) => set({ onCreate: onCreate }),

  pageContent: 1,
  setPageContent: (page: number) => set({ pageContent: page }),

  onDelete: null,
  setOnDelete: (agenda: Prisma.AgendaGetPayload<object> | null) =>
    set({ onDelete: agenda }),

  onUpdate: null,
  setOnUpadate: (agenda: null | Prisma.AgendaGetPayload<object>) =>
    set({ onUpdate: agenda }),
}));
