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
import { toast } from "sonner";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { useUserSession } from "@/lib/zustand";
import { RequestUserDelete, RequestUserUpdate } from "@/dtype/request-item";

const ListUser = ({
  queryUser,
  setPageUser,
  pageUser,
  setUpdateUser,
}: {
  setPageUser: Dispatch<SetStateAction<number>>;
  pageUser: number;
  queryUser: UseQueryResult<ApiResponse<Prisma.UserGetPayload<object>[]>>;
  setUpdateUser: (user: null | Prisma.UserGetPayload<object>) => void;
}) => {
  return (
    <div className="w-full flex items-center justify-center flex-wrap gap-10">
      <span className="w-full flex items-center justify-start text-lg font-extrabold text-center gap-x-1.5">
        Daftar User
        <RefreshCcw
          onClick={() => queryUser.refetch()}
          className={`size-3 ${(queryUser.isRefetching || queryUser.isRefetching) && "animate-spin"}`}
        />
      </span>
      {queryUser.isRefetching || queryUser.isLoading ? (
        <div className="w-full flex items-center justify-center flex-wrap gap-5">
          <div className="bg-primary/30 w-40 h-40 rounded-xl animate-pulse"></div>
          <div className="bg-primary/30 w-40 h-40 rounded-xl animate-pulse"></div>
          <div className="bg-primary/30 w-40 h-40 rounded-xl animate-pulse"></div>
          <div className="bg-primary/30 w-40 h-40 rounded-xl animate-pulse"></div>
          <div className="bg-primary/30 w-40 h-40 rounded-xl animate-pulse"></div>
        </div>
      ) : queryUser.isError ? (
        <div className="w-full flex flex-col gap-y-1 items-center justify-center h-50">
          Terjadi Error
          <span
            onClick={() => queryUser.refetch()}
            className="flex items-center justify-center gap-x-1 bg-primary px-3 py-1 rounded-xl text-white"
          >
            Coba Refresh <RefreshCcw className="size-3" />
          </span>
        </div>
      ) : queryUser.isSuccess && queryUser.data.data.total < 1 ? (
        <div className="w-full flex flex-col gap-y-1 items-center justify-center h-50">
          Tidak ada user
          <span
            onClick={() => queryUser.refetch()}
            className="flex items-center justify-center gap-x-1 bg-primary px-3 py-1 rounded-xl text-white"
          >
            Coba Refresh <RefreshCcw className="size-3" />
          </span>
        </div>
      ) : (
        queryUser.isSuccess &&
        queryUser.data.success && (
          <>
            <div className="w-full flex items-center justify-center flex-wrap gap-5 ">
              {queryUser.data.data.data.map((e, i) => (
                <div
                  onClick={() => setUpdateUser(e)}
                  className="bg-primary w-40 h-40 rounded-xl relative overflow-hidden"
                  key={i}
                >
                  {e.image && (
                    <Image
                      fill
                      alt="..."
                      src={e.image}
                      className="object-cover absolute z-1"
                    />
                  )}
                  <div className="w-full max-w-40 h-full bg-black/50 z-2 absolute flex flex-col items-center justify-start pt-2">
                    <p className="w-35 flex flex-wrap items-start justify-start text-white font-extrabold text-lg wrap-anywhere pb-1">
                      {e.name}
                    </p>
                    <p className="w-35 flex flex-wrap items-start justify-start text-white  text-xs wrap-anywhere font-bold">
                      {e.email}
                    </p>
                    <p className="w-35 flex flex-wrap items-start justify-start text-white  text-[0.6rem] wrap-anywhere">
                      {e.role}
                    </p>
                    <p className="w-35 flex flex-wrap items-start justify-start text-white  text-[0.6rem] wrap-anywhere">
                      Bergabung: {formatDate(new Date(e.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className=" flex items-center justify-center text-center w-full md:w-md gap-x-5 my-10">
              <button
                disabled={!queryUser.isSuccess}
                className={` py-0.5 font-bold flex-1 rounded-md transition-all ease-in-out duration-200 ${pageUser <= 1 || !queryUser.isSuccess ? "text-muted bg-muted-foreground" : "bg-primary text-white"}`}
                onClick={() => {
                  if (pageUser <= 1) return;
                  setPageUser(pageUser - 1);
                  queryUser.refetch();
                }}
              >
                Sebelumnya
              </button>
              <span className="shrink-0">
                {pageUser} /{Math.ceil(queryUser.data?.data.total / 10)}
              </span>

              <button
                disabled={!queryUser.isSuccess}
                className={` py-0.5 font-bold flex-1 rounded-md transition-all ease-in-out duration-200 ${pageUser >= Math.ceil(queryUser.data?.data.total / 10) || !queryUser.isSuccess ? "text-muted bg-muted-foreground" : "bg-primary text-white"}`}
                onClick={() => {
                  if (pageUser >= Math.ceil(queryUser.data?.data.total / 10))
                    return;
                  setPageUser(pageUser + 1);
                  queryUser.refetch();
                }}
              >
                Selanjutnya
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
};

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

  const tambahItemRef = useRef<HTMLInputElement>(null);
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [children?.toString().toLowerCase()],
      });
    },
  });

  const handleButtonCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (tambahItemRef.current!.value.trim() === "") return;
    const newName = tambahItemRef.current!.value;
    mutationCreate.mutateAsync({ name: newName as string }).then((e) => {
      queryClient.invalidateQueries({
        queryKey: [children?.toString().toLowerCase()],
      });
      toast("Pesan", {
        closeButton: true,
        description: e.message,
      });
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
                        toast("Pesan", {
                          closeButton: true,
                          description: e.message,
                        });
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
  const queryClient = useQueryClient();

  const [onEditItem, setOnEditItem] = useState<UseMutationResult | null>(null);
  const updateItemRef = useRef<HTMLInputElement>(null);

  const updateUser = useUserSession((state) => state.updateUser);
  const setUpdateUser = useUserSession((state) => state.setUpdateUser);
  const refUserUpdate = useRef<HTMLSelectElement>(null);

  const batchContent = 12;
  const [pageContent, setPageContent] = useState<number>(1);
  const [pageUser, setPageUser] = useState<number>(1);

  const querySemuaAcara = useQuery({
    queryKey: [
      "agenda",
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

  const querySemuaUser = useQuery<ApiResponse<Prisma.UserGetPayload<object>[]>>(
    {
      queryKey: [
        "user",
        {
          page: pageUser,
          batch: batchContent,
        },
      ],
      queryFn: () =>
        apiFetch("/api/query/user/getAll", {
          method: "POST",
          body: JSON.stringify({
            page: pageUser,
            batch: batchContent,
          }),
        }).then((e) => e.json()),
    },
  );

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

  const mutationUserUpdate = useMutation({
    mutationFn: (body: RequestUserUpdate) =>
      apiFetch("/api/query/user", {
        method: "PUT",
        body: JSON.stringify(body),
      }).then((e) => e.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });

  const mutationUserDelete = useMutation({
    mutationFn: (body: RequestUserDelete) =>
      apiFetch("/api/query/user", {
        method: "DELETE",
        body: JSON.stringify(body),
      }).then((e) => e.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });

  return (
    <div className="w-full h-dvh flex items-start justify-start p-5 text-xs flex-col">
      <Portal onOpen={!!updateUser}>
        {!!updateUser && (
          <div className="w-full h-dvh flex items-center justify-center ">
            <div className="bg-white flex items-start justify-start p-3 gap-x-2  rounded-xl flex-col">
              <span>{updateUser?.name}</span>
              <span>{updateUser?.email}</span>
              <select
                ref={refUserUpdate}
                defaultValue={updateUser!.role}
                className="my-3"
              >
                <option value={"SUDO"}>Sudo</option>
                <option value={"SUPERUSER"}>SuperUser</option>
                <option value={"USER"}>User</option>
              </select>
              <div className="flex items-start justify-start gap-x-2">
                <button
                  className="flex-1 flex items-center justify-center text-center bg-neutral-300 text-neutral-500 py-2 rounded-xl active:bg-primary active:text-white hover:bg-primary hover:text-white transition-colors ease-in-out duration-200 px-2"
                  onClick={() => setUpdateUser(null)}
                >
                  Kembali
                </button>
                <button
                  disabled={
                    mutationUserUpdate.isPending || mutationUserDelete.isPending
                  }
                  className="flex-1 flex items-center justify-center text-center bg-neutral-300 text-neutral-500 py-2 rounded-xl active:bg-green-500 active:text-white hover:bg-green-500 hover:text-white transition-colors ease-in-out duration-200 px-2"
                  onClick={() => {
                    mutationUserUpdate
                      .mutateAsync({
                        id: updateUser!.id,
                        role: refUserUpdate.current!.value,
                      })
                      .then((e) => {
                        setUpdateUser(null);
                        toast("Pesan", {
                          description: e.message,
                          closeButton: true,
                        });
                      });
                  }}
                >
                  {mutationUserDelete.isPending ||
                  mutationUserDelete.isPending ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </button>
                <button
                  onClick={() => {
                    mutationUserDelete
                      .mutateAsync({
                        id: updateUser!.id,
                      })
                      .then((e) => {
                        setUpdateUser(null);
                        toast("Pesan", {
                          description: e.message,
                          closeButton: true,
                        });
                      });
                  }}
                  className="flex-1 flex items-center justify-center text-center bg-neutral-300 text-neutral-500 py-2 rounded-xl active:bg-red-500 active:text-white hover:bg-red-500 hover:text-white transition-colors ease-in-out duration-200 px-2"
                >
                  {mutationUserDelete.isPending ||
                  mutationUserDelete.isPending ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    "Hapus"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </Portal>
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
                      toast("Pesan", {
                        closeButton: true,
                        description:
                          typeof e === "object" &&
                          e !== null &&
                          "message" in e &&
                          (e.message as string),
                      });
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
          <ItemTab
            aktifTab={aktifTab}
            onClick={() => setAktifTab("Daftar User")}
          >
            Daftar User
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
        ) : aktifTab === "Daftar Item" ? (
          <div className="w-full flex items-center justify-center flex-wrap gap-10">
            <ListItem setOnEditItem={setOnEditItem} itemContent={queryKategori}>
              Kategori
            </ListItem>
            <ListItem setOnEditItem={setOnEditItem} itemContent={queryTopik}>
              Topik
            </ListItem>
            <ListItem setOnEditItem={setOnEditItem} itemContent={queryKota}>
              Kota
            </ListItem>
            <ListItem setOnEditItem={setOnEditItem} itemContent={queryKalangan}>
              Kalangan
            </ListItem>
            <ListItem setOnEditItem={setOnEditItem} itemContent={queryBiaya}>
              Biaya
            </ListItem>
          </div>
        ) : (
          aktifTab === "Daftar User" && (
            <ListUser
              pageUser={pageUser}
              queryUser={querySemuaUser}
              setPageUser={setPageUser}
              setUpdateUser={setUpdateUser}
            />
          )
        )}
      </div>
    </div>
  );
}
