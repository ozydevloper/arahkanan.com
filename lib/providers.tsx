"use client";

import {
  DetailAgenda,
  PopUpDeleteAgenda,
} from "@/components/core-ui-new/content/content";
import { Portal } from "@/components/core-ui-new/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAgendas, useUserSession } from "./zustand";
import { UpdateAgenda } from "@/components/core-ui-new/topbar/updateAgenda";
import { useSession } from "next-auth/react";
import { CreateAgenda } from "@/components/core-ui-new/topbar/createAgenda";
import { Toaster } from "sonner";

export default function Providers({
  children,
}: {
  children?: React.ReactNode;
}) {
  const session = useSession();

  const onDetail = useAgendas((state) => state.onDetail);
  const onDelete = useAgendas((state) => state.onDelete);
  const onCreate = useAgendas((state) => state.onCreate);
  const onUpdate = useAgendas((state) => state.onUpdate);

  const setOnCreate = useAgendas((state) => state.setOnCreate);
  const setDataUser = useUserSession((state) => state.setDataUser);

  const dataUser = useUserSession((state) => state.dataUser);

  useEffect(() => {
    function updateUser() {
      if (session.data) {
        if (session.data.user) {
          setDataUser(session.data.user);
        }
      }
    }
    updateUser();
  }, [session.data, setDataUser]);

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
      <Toaster duration={5000} position="top-center" />
      {dataUser && dataUser.id && (
        <>
          <Portal onOpen={onCreate} typeFor="create">
            {onCreate && (
              <CreateAgenda
                onClick={() => setOnCreate(!onCreate)}
                onCreate={onCreate}
              />
            )}
          </Portal>

          <Portal typeFor="delete" onOpen={!!onDelete}>
            {onDelete && <PopUpDeleteAgenda agenda={onDelete} />}
          </Portal>

          <Portal typeFor="formUpdate" onOpen={!!onUpdate}>
            {!!onUpdate && <UpdateAgenda agenda={onUpdate} />}
          </Portal>
        </>
      )}
      <Portal typeFor="detail" onOpen={!!onDetail}>
        {onDetail && <DetailAgenda agenda={onDetail} />}
      </Portal>
      {children}
    </QueryClientProvider>
  );
}
