"use client";
import { Prisma } from "@/app/generated/prisma/client";
import Loading from "@/app/loading";
import { ApiResponse } from "@/dtype/api_response";
import { apiFetch } from "@/lib/signature";
import { useQuery } from "@tanstack/react-query";
import { DetailAgenda } from "./content/content";
import { useRouter } from "next/navigation";
import NotFound from "@/app/not-found";

export const DetailSharedId = ({ idAgenda }: { idAgenda: string }) => {
  const router = useRouter();
  const queryAgenda = useQuery<
    ApiResponse<Prisma.AgendaGetPayload<{ include: { user_relation: true } }>>
  >({
    queryKey: ["agendaShared"],
    queryFn: () =>
      apiFetch("/api/query/agenda/getById", {
        method: "POST",
        body: JSON.stringify({ id: idAgenda }),
      }).then((e) => e.json()),
  });

  return (
    <div>
      {queryAgenda.isLoading ? (
        <Loading />
      ) : queryAgenda.isError ||
        !queryAgenda.data?.data.data ||
        !queryAgenda.data.data.data.published ? (
        <NotFound />
      ) : (
        queryAgenda.isSuccess && (
          <DetailAgenda
            closeButton={false}
            agenda={queryAgenda.data.data.data}
          />
        )
      )}
    </div>
  );
};
