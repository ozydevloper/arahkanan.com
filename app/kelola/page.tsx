"use client";
import { ContentAgenda } from "@/components/core-ui-new/content/content";
import LogoApp from "@/components/core-ui-new/logo-app";
import { ApiResponse } from "@/dtype/api_response";
import { apiFetch } from "@/lib/signature";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  Edit,
  Loader,
  RefreshCcw,
  SendHorizonalIcon,
  Trash,
} from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Prisma } from "../generated/prisma/client";
import { Portal } from "@/components/core-ui-new/portal";

const ListItem = ({
  children,
  itemContent,
  setOnEditItem,
}: {
  children: React.ReactNode;
  itemContent: UseQueryResult<ApiResponse<{ name: string; id: string }[]>>;
  setOnEditItem: Dispatch<SetStateAction<UseMutationResult | null>>;
}) => {
  const queryClient = useQueryClient();

  const tambahItemRef = useRef(null);
  const [prosesItemIdUpdate, setProsesItemIdUpdate] = useState<string | null>(
    null,
  );

  const mutationCreate = useMutation({
    mutationFn: (body: { name: string }) =>
      apiFetch(
        `/api/query/item/${children?.toString().toLowerCase()}/createItem`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      ).then((e) => e.json()),
  });

  const mutationDelete = useMutation({
    mutationFn: (body: { id: string }) =>
      apiFetch(
        `/api/query/item/${children?.toString().toLowerCase()}/deleteItem`,
        {
          method: "DELETE",
          body: JSON.stringify(body),
        },
      ).then((e) => e.json()),
  });
  const mutationUpdate = useMutation({
    mutationFn: (body: { name: string }) =>
      apiFetch(
        `/api/query/item/${children?.toString().toLowerCase()}/updateItem`,
        {
          method: "PUT",
          body: JSON.stringify({
            id: prosesItemIdUpdate,
            name: body.name,
          }),
        },
      ).then((e) => e.json()),
    onSettled: () => setProsesItemIdUpdate(null),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [children?.toString().toLowerCase()],
      }),
  });

  const handleButtonCreate = (e) => {
    e.preventDefault();
    if (tambahItemRef.current!.value.trim() === "") return;
    const newName = tambahItemRef.current!.value;
    mutationCreate.mutateAsync({ name: newName as string }).then((e) => {
      queryClient.invalidateQueries({
        queryKey: [children?.toString().toLowerCase()],
      });
      alert(JSON.stringify(e));
    });
  };

  return (
    <div className=" w-full md:max-w-50 h-75 max-h-75 flex flex-col items-start justify-start">
      <span className="text-xl font-extrabold mb-2 flex items-center justify-start text-start gap-x-1">
        {children}
        <RefreshCcw
          onClick={() => itemContent.refetch()}
          className={`${itemContent.isFetching ? "animate-spin" : ""} size-4`}
        />
      </span>
      <div className="w-full flex gap-x-1">
        <input
          ref={tambahItemRef}
          placeholder={`Buat ${children?.toString().toLowerCase()}...`}
          className="border w-full p-3 rounded-xl shadow-md flex-1 outline-none focus:border-primary"
        />
        <button
          disabled={mutationCreate.isPending}
          onClick={handleButtonCreate}
          className="shrink-0 flex items-center justify-center border px-2 shadow rounded-xl"
        >
          {mutationCreate.isPending ? (
            <Loader className="size-6 animate-spin" />
          ) : (
            <SendHorizonalIcon className="size-6" />
          )}
        </button>
      </div>
      <div className="w-full flex flex-col flex-1 overflow-y-auto items-center justify-start ">
        {itemContent.isLoading || itemContent.isRefetching ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader className="animate-spin" />
          </div>
        ) : itemContent.isError ? (
          <div className="flex-1 flex items-center justify-center">
            <span
              onClick={() => itemContent.refetch()}
              className="flex w-min items-center justify-center gap-x-1 px-2 py-1 bg-red-500 text-white rounded-xl"
            >
              Error
              <RefreshCcw className="size-3" />
            </span>
          </div>
        ) : itemContent.isSuccess && itemContent.data.data.total <= 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <span
              onClick={() => itemContent.refetch()}
              className="flex w-min items-center justify-center gap-x-1 px-2 py-1 bg-primary text-white rounded-xl"
            >
              Sepertinya tidak ada, coba buat baru
              <RefreshCcw className="size-3" />
            </span>
          </div>
        ) : (
          itemContent.data?.data.data.map((e, i) => (
            <div key={i} className="w-full text-sm border-b p-3 flex">
              <span className="flex-1 truncate">{e.name}</span>
              {mutationDelete.isPending || mutationUpdate.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <div className="shrink-0 flex items-center justify-center gap-x-3">
                  <button
                    disabled={mutationUpdate.isPending}
                    onClick={() => {
                      setProsesItemIdUpdate(e.id);
                      setOnEditItem(mutationUpdate as UseMutationResult);
                    }}
                  >
                    <Edit className="size-5 active:text-green-600 transition-colors ease-in-out duration-200" />
                  </button>
                  <button
                    disabled={mutationDelete.isPending}
                    onClick={() =>
                      mutationDelete.mutateAsync({ id: e.id }).then((e) => {
                        queryClient.invalidateQueries({
                          queryKey: [children?.toString().toLowerCase()],
                        });
                        alert(JSON.stringify(e));
                      })
                    }
                  >
                    <Trash className="size-5 active:text-red-600 transition-colors ease-in-out duration-200" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ItemTab = ({
  children,
  aktifTab,
  onClick,
}: {
  children: React.ReactNode;
  aktifTab: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`px-5 py-2 font-bold hover:border-b-2 transition-all ease-in-out duration-300 ${aktifTab === children ? "text-primary border-b-2 border-primary" : ""}`}
    >
      {children}
    </div>
  );
};

export default function Page() {
  const [aktifTab, setAktifTab] = useState<string>("Daftar Acara");

  const [onEditItem, setOnEditItem] = useState<UseMutationResult | null>(null);
  const updateItemRef = useRef(null);

  const batchContent = 10;
  const [pageContent, setPageContent] = useState<number>(1);

  const querySemuaAcara = useQuery({
    queryKey: [
      "semuaAgendaKelola",
      {
        all: true,
        page: pageContent,
        batch: batchContent,
      },
    ],
    queryFn: () =>
      apiFetch("/api/query/agenda/getSomeAgendas", {
        method: "POST",
        body: JSON.stringify({
          all: true,
          page: pageContent,
          batch: batchContent,
        }),
      }).then((e) => e.json()),
    enabled: aktifTab === "Daftar Acara",
  });

  const queryKategori = useQuery<
    ApiResponse<Prisma.KategoriGetPayload<object>[]>
  >({
    queryKey: ["kategori"],
    queryFn: () =>
      apiFetch("/api/query/item/kategori/getAllItems", {
        method: "POST",
      }).then((e) => e.json()),
    enabled: aktifTab === "Daftar Item",
  });

  const queryTopik = useQuery<ApiResponse<Prisma.TopikGetPayload<object>[]>>({
    queryKey: ["topik"],
    queryFn: () =>
      apiFetch("/api/query/item/topik/getAllItems", {
        method: "POST",
      }).then((e) => e.json()),
    enabled: aktifTab === "Daftar Item",
  });

  const queryKota = useQuery<ApiResponse<Prisma.KotaGetPayload<object>[]>>({
    queryKey: ["kota"],
    queryFn: () =>
      apiFetch("/api/query/item/kota/getAllItems", {
        method: "POST",
      }).then((e) => e.json()),
    enabled: aktifTab === "Daftar Item",
  });

  const queryKalangan = useQuery<
    ApiResponse<Prisma.KalanganGetPayload<object>[]>
  >({
    queryKey: ["kalangan"],
    queryFn: () =>
      apiFetch("/api/query/item/kalangan/getAllItems", {
        method: "POST",
      }).then((e) => e.json()),
    enabled: aktifTab === "Daftar Item",
  });

  const queryBiaya = useQuery<ApiResponse<Prisma.BiayaGetPayload<object>[]>>({
    queryKey: ["biaya"],
    queryFn: () =>
      apiFetch("/api/query/item/biaya/getAllItems", {
        method: "POST",
      }).then((e) => e.json()),
    enabled: aktifTab === "Daftar Item",
  });

  return (
    <div className="w-full h-dvh flex items-start justify-start p-5 text-xs flex-col">
      <Portal onOpen={!!onEditItem}>
        <div className="w-full h-dvh flex items-center justify-center">
          <div className="w-sm max-w-sm bg-white py-5 px-3 rounded-xl">
            <span className="text-xl font-bold ">Perbarui item</span>
            <input
              ref={updateItemRef}
              placeholder="Update menjadi..."
              className="border w-full p-3 rounded-xl shadow-md flex-1 outline-none focus:border-primary mt-3 mb-5"
            />
            <div className="w-full flex gap-x-5">
              <button
                onClick={() => setOnEditItem(null)}
                className="flex-1 flex items-center justify-center text-center bg-neutral-300 text-neutral-500 py-2 rounded-xl active:bg-red-500 active:text-white hover:bg-red-500 hover:text-white transition-colors ease-in-out duration-200"
              >
                Batal
              </button>
              <button
                disabled={onEditItem?.isPending}
                onClick={() => {
                  if (updateItemRef.current!.value.trim() === "") return;
                  onEditItem
                    ?.mutateAsync({
                      name: updateItemRef.current!.value,
                    })
                    .then((e) => {
                      setOnEditItem(null);
                      alert(JSON.stringify(e));
                    });
                  updateItemRef.current!.value = "";
                }}
                className={`flex-1 flex items-center justify-center text-center bg-neutral-300 text-neutral-500 py-2 rounded-xl active:bg-green-500 active:text-white hover:bg-green-500 hover:text-white transition-colors ease-in-out duration-200 ${onEditItem?.isPending && "bg-green-500 text-white"}`}
              >
                {onEditItem?.isPending ? (
                  <Loader className="size-5 animate-spin" />
                ) : (
                  "Perbarui"
                )}
              </button>
            </div>
          </div>
        </div>
      </Portal>
      <div className="w-full flex items-center justify-center">
        <LogoApp className="shrink-0" />
        <div className="flex-1 flex items-center justify-center text-center">
          <ItemTab
            aktifTab={aktifTab}
            onClick={() => setAktifTab("Daftar Acara")}
          >
            Daftar Acara
          </ItemTab>
          <ItemTab
            aktifTab={aktifTab}
            onClick={() => setAktifTab("Daftar Item")}
          >
            Daftar Item
          </ItemTab>
        </div>
      </div>
      <div className="w-full mt-10">
        {aktifTab === "Daftar Acara" ? (
          <ContentAgenda
            batch={batchContent}
            contentAgenda={querySemuaAcara}
            page={pageContent}
            setPage={setPageContent}
          >
            Daftar Semua Acara
          </ContentAgenda>
        ) : (
          aktifTab === "Daftar Item" && (
            <div className="w-full flex items-center justify-center flex-wrap gap-10">
              <ListItem
                setOnEditItem={setOnEditItem}
                itemContent={queryKategori}
              >
                Kategori
              </ListItem>
              <ListItem setOnEditItem={setOnEditItem} itemContent={queryTopik}>
                Topik
              </ListItem>
              <ListItem setOnEditItem={setOnEditItem} itemContent={queryKota}>
                Kota
              </ListItem>
              <ListItem
                setOnEditItem={setOnEditItem}
                itemContent={queryKalangan}
              >
                Kalangan
              </ListItem>
              <ListItem setOnEditItem={setOnEditItem} itemContent={queryBiaya}>
                Biaya
              </ListItem>
            </div>
          )
        )}
      </div>
    </div>
  );
}
