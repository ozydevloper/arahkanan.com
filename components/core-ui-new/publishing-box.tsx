"use client";

import { apiFetch } from "@/lib/signature";
import { useAgendas } from "@/lib/zustand";
import { useQuery } from "@tanstack/react-query";
import { ContentAgenda } from "./content/content";
import { useState } from "react";
import { X } from "lucide-react";

export const PublishingBox = ({ onClick }: { onClick: () => void }) => {
  const onPublishing = useAgendas((state) => state.onPublishing);
  const [page, setPage] = useState<number>(1);
  const batch = 10;
  const queryAgendaUnpublish = useQuery({
    queryKey: ["unpublish", { page: page, batch: batch }],
    queryFn: () =>
      apiFetch("/api/query/agenda/getAgendaUnpublished", {
        method: "POST",
        body: JSON.stringify({
          page: page,
          batch: 10,
        }),
      }).then((e) => e.json()),
    enabled: onPublishing,
  });
  return (
    <div className="w-full h-dvh bg-white flex flex-col -z-10">
      <div className="shink-0 flex items-center justify-center px-5 pt-5">
        <span className="flex-1 text-sm font-bold">Acara UnPublished</span>
        <X className="shrink-0" onClick={onClick} />
      </div>
      <ContentAgenda
        batch={batch}
        contentAgenda={queryAgendaUnpublish}
        page={page}
        setPage={setPage}
      >
        Menunggu di publish
      </ContentAgenda>
    </div>
  );
};
