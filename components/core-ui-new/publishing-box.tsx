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
  const batch = 12;
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
    <div className="w-full h-dvh bg-white flex flex-col items-center">
      <div className="w-full flex items-center justify-end p-5 ">
        <X className="shrink-0" onClick={onClick} />
      </div>
      <div className="max-w-[1080px] w-full ">
        <ContentAgenda
          batch={batch}
          contentAgenda={queryAgendaUnpublish}
          page={page}
          setPage={setPage}
        >
          Menunggu di publish
        </ContentAgenda>
      </div>
    </div>
  );
};
