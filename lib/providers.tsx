"use client";

import {
  DetailAgenda,
  PopUpDeleteAgenda,
} from "@/components/core-ui-new/content/content";
import { Portal } from "@/components/core-ui-new/portal";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useAgendas } from "./zustand";
import { UpdateAgenda } from "@/components/core-ui-new/topbar/updateAgenda";

export default function Providers({
  children,
}: {
  children?: React.ReactNode;
}) {
  const onDetail = useAgendas((state) => state.onDetail);
  const onDelete = useAgendas((state) => state.onDelete);
  const onUpdate = useAgendas((state) => state.onUpdate);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Portal onOpen={!!onDetail}>
        {onDetail && <DetailAgenda agenda={onDetail} />}
      </Portal>

      <Portal onOpen={!!onDelete}>
        {onDelete && <PopUpDeleteAgenda agenda={onDelete} />}
      </Portal>

      <Portal onOpen={!!onUpdate}>
        {!!onUpdate && <UpdateAgenda agenda={onUpdate} />}
      </Portal>

      {children}
    </QueryClientProvider>
  );
}
