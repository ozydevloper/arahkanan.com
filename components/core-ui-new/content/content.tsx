"use client";
import { Prisma } from "@/app/generated/prisma/client";
import { ApiResponse } from "@/dtype/api_response";
import { apiFetch } from "@/lib/signature";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { LoadingContentIcon, StateContent } from "./stateContent";
import { useAgendas, useUserSession } from "@/lib/zustand";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  Clock,
  Folder,
  Handshake,
  Home,
  LinkIcon,
  Loader,
  Locate,
  Mic,
  Share,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RequestAgendaDelete } from "@/dtype/request-item";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Tab = ({
  children,
  focusTab,
  onClick,
}: {
  children: React.ReactNode;
  focusTab?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`text-xs font-bold px-2 min-w-fit pt-4 pb-2 hover:border-b-2 hover:border-primary hover:text-primary active:border-b-2 active:border-primary active:text-primary transition-all ease-in-out duration-200 ${focusTab === children && "border-b-2 border-primary text-primary"}`}
    >
      {children}
    </div>
  );
};

export const PopUpDeleteAgenda = ({
  agenda,
}: {
  agenda: Prisma.AgendaGetPayload<{
    include: {
      user_relation: true;
    };
  }>;
}) => {
  const setOnDelete = useAgendas((state) => state.setOnDelete);
  const setOnDetail = useAgendas((state) => state.setOnDetail);

  const mutationDeleteAgenda = useMutation({
    mutationFn: (data: RequestAgendaDelete) =>
      apiFetch("/api/query/agenda/deleteAgenda", {
        method: "DELETE",
        body: JSON.stringify(data),
      }).then((e) => e.json()),
  });

  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col items-center justify-start bg-white p-5 rounded-xl ">
        <span className="text-wrap w-full font-bold text-lg  flex text-center items-center justify-center">
          Yakin ingin hapus?
        </span>
        <p className="text-wrap w-70 flex text-center justify-center items-center flex-wrap">
          {agenda.title}
        </p>
        <div className="w-full flex gap-x-5 mt-5">
          <button
            disabled={mutationDeleteAgenda.isPending}
            onClick={() => setOnDelete(null)}
            className={`flex flex-1 bg-neutral-300 text-neutral-500  text-center items-center justify-center p-2 rounded-xl transition-color ease-in-out duration-200 ${mutationDeleteAgenda.isPending ? "" : "hover:bg-primary hover:text-white active:bg-primary active:text-white"}`}
          >
            Kembali
          </button>
          <button
            disabled={mutationDeleteAgenda.isPending}
            onClick={() =>
              mutationDeleteAgenda
                .mutateAsync({
                  id: agenda.id,
                  user_id: agenda.user_relation.id,
                })
                .then((e) => {
                  setOnDelete(null);
                  setOnDetail(null);
                  toast("Pesan", { description: e.message, closeButton: true });
                })
            }
            className={`flex flex-1 bg-neutral-300 text-neutral-500 text-center items-center justify-center p-2 rounded-xl ${mutationDeleteAgenda.isPending ? "bg-red-500 text-white" : "hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white transition-color ease-in-out duration-200"}`}
          >
            {mutationDeleteAgenda.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              "Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ContentAgenda = ({
  children,
  contentAgenda,
  page,
  setPage,
  batch,
}: {
  children: React.ReactNode;
  contentAgenda: UseQueryResult<
    ApiResponse<
      Prisma.AgendaGetPayload<{
        include: {
          user_relation: true;
        };
      }>[]
    >
  >;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  batch: number;
}) => {
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    const updateTotalPage = () =>
      contentAgenda.isSuccess && setTotalPage(contentAgenda.data?.data?.total);
    updateTotalPage();
    return () => setTotalPage(0);
  }, [contentAgenda.isSuccess, contentAgenda.data?.data?.total]);

  return (
    <div className="flex flex-col gap-y-3">
      <span className="font-bold text-xl flex items-center justify-start text-center gap-x-1">
        {children}
        <LoadingContentIcon contentQuery={contentAgenda} />
      </span>
      <StateContent contentQuery={contentAgenda} />
      <div className="w-full  text-sm flex items-center justify-center">
        <div className=" flex items-center justify-center text-center w-full md:w-md gap-x-5 my-10">
          <button
            disabled={!contentAgenda.isSuccess}
            className={` py-0.5 font-bold flex-1 rounded-md transition-all ease-in-out duration-200 ${page <= 1 || !contentAgenda.isSuccess ? "text-muted bg-muted-foreground" : "bg-primary text-white"}`}
            onClick={() => {
              if (page <= 1) return;
              setPage(page - 1);
              contentAgenda.refetch();
            }}
          >
            Sebelumnya
          </button>
          <span className="shrink-0">
            {page} /{Math.ceil(totalPage / batch)}
          </span>

          <button
            disabled={!contentAgenda.isSuccess}
            className={` py-0.5 font-bold flex-1 rounded-md transition-all ease-in-out duration-200 ${page >= Math.ceil(totalPage / batch) || !contentAgenda.isSuccess ? "text-muted bg-muted-foreground" : "bg-primary text-white"}`}
            onClick={() => {
              if (page >= Math.ceil(totalPage / batch)) return;
              setPage(page + 1);
              contentAgenda.refetch();
            }}
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
};

export const DetailAgenda = ({
  agenda,
  closeButton = true,
}: {
  agenda: Prisma.AgendaGetPayload<{ include: { user_relation: true } }>;
  closeButton?: boolean;
}) => {
  const setOnDetail = useAgendas((state) => state.setOnDetail);
  const setOnDelete = useAgendas((state) => state.setOnDelete);
  const setOnUpdate = useAgendas((state) => state.setOnUpadate);

  const onPublishing = useAgendas((state) => state.onPublishing);

  const dataUser = useUserSession((state) => state.dataUser);

  const router = useRouter();

  const queryClient = useQueryClient();

  const mutationPublish = useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch("/api/query/agenda/updateAgenda", {
        method: "PUT",
        body: formData,
      }).then((e) => e.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unpublish"] });
      setOnDetail(null);
    },
  });

  return (
    <div className="w-full h-fit rounded-b-2xl flex flex-col items-center justify-start bg-primary-foreground overflow-y-auto relative">
      {closeButton && (
        <div
          onClick={() => setOnDetail(null)}
          className="p-1 fixed right-5 z-1 top-5 rounded-xl hover:bg-red-500 hover:text-red-50 active:bg-red-700 active:text-red-200 transition-all ease-in-out duration-200"
        >
          <X size={25} />
        </div>
      )}
      <div className="w-full md:w-[1150px] h-[200px] md:h-[400px] relative overflow-hidden">
        <Image
          fill
          alt="..."
          src={agenda.image_url ?? "/lu.webp"}
          priority={false}
          className="object-center blur-md scale-110"
        />
        <Image
          src={agenda.image_url ?? "/lu.webp"}
          alt="..."
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="w-full items-center px-3 md:px-25">
        <div className="w-full flex items-center justify-start gap-x-2 my-3">
          {((dataUser && dataUser.role === "SUDO") ||
            (dataUser &&
              dataUser.role === "SUPERUSER" &&
              dataUser.id === agenda.user_id &&
              onPublishing)) && (
            <>
              <button
                disabled={mutationPublish.isPending}
                onClick={() => setOnUpdate(agenda)}
                className="px-3 py-2 bg-green-500 text-white rounded-xl "
              >
                {mutationPublish.isPending ? (
                  <Loader className="size-5 animate-spin" />
                ) : (
                  "Update"
                )}
              </button>
              <button
                disabled={mutationPublish.isPending}
                onClick={() => setOnDelete(agenda)}
                className="px-3 py-2 bg-red-500 text-white rounded-xl "
              >
                {mutationPublish.isPending ? (
                  <Loader className="size-5 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </>
          )}
          {dataUser && dataUser.role === "SUDO" && (
            <>
              <button
                disabled={mutationPublish.isPending}
                onClick={() => {
                  const formData = new FormData();
                  formData.append("id", agenda.id as string);
                  formData.append("published", agenda.published ? "0" : "1");
                  mutationPublish.mutateAsync(formData).then((e) =>
                    toast("Pesan", {
                      description: e.message,
                      closeButton: true,
                    }),
                  );
                }}
                className="px-3 py-2 bg-primary text-white rounded-xl "
              >
                {mutationPublish.isPending ? (
                  <Loader className="size-5 animate-spin" />
                ) : agenda.published ? (
                  "Jangan Publish"
                ) : (
                  "Publish"
                )}
              </button>
            </>
          )}
        </div>
        <div className="w-full flex items-center justify-between py-2">
          <div className="px-3 py-1 text-sm bg-green-200 text-green-500 border-green-100 rounded-2xl">
            {agenda.biaya_name}
          </div>
          <Share
            onClick={() => {
              setOnDetail(null);
              router.push(`/${agenda.id}`);
            }}
            className="size-6 md:size-7 active:text-primary transition-colors ease-in-out duration-200"
          />
        </div>
        <div className="w-full flex-col flex flex-wrap text-wrap items-start justify-center gap-y-3 pb-5 border-b mb-10">
          <span className="text-xl md:text-3xl font-extrabold text-wrap wrap-anywhere">
            {agenda.title}
          </span>
          <div className="flex flex-col items-start justify-center text-sm">
            <a
              href={"#link"}
              className="text-center gap-x-1 flex text-wrap items-start justify-start font-light text-blue-900 wrap-anywhere"
            >
              <Locate className="size-4 shrink-0" />
              {agenda.on.toString() === "1" ? (
                <span className="flex-1 text-start ">
                  {agenda.location_detail} - {agenda.kota_name}
                </span>
              ) : (
                agenda.via_name
              )}
            </a>
            <span className="text-center gap-x-1 flex items-center justify-start font-light flex-wrap text-wrap">
              <Calendar className="size-4" />{" "}
              {formatDate(new Date(agenda.date))}
            </span>
          </div>
        </div>
        <div className="w-full flex items-start justify-start flex-col gap-y-2 min-h-50 pb-5">
          <span className="text-base font-bold">Deskripsi</span>
          <p className="wrap-anywhere text-sm w-full text-wrap">
            {agenda.description}
          </p>
        </div>
        <div className="w-full flex items-start justify-start flex-col pb-5 border-b mb-10">
          <span className="text-xs font-normal flex items-start justify-start gap-x-1">
            <Folder className="size-4" />
            Kategori - {agenda.kategori_name}
          </span>
          <span className="font-normal text-xs flex items-start justify-start gap-x-1">
            <BookOpen className="size-4" />
            Topik - {agenda.topik_name}
          </span>
        </div>
        <div className="w-full flex items-start justify-start flex-col gap-y-2 pb-5 border-b mb-10">
          <span className="text-base font-bold">Waktu Acara</span>
          <span className="font-normal text-xs flex items-center justify-start gap-x-1">
            <Clock className="size-4" /> {agenda.time}
          </span>
          <p className="whitespace-pre-line text-xs border p-2 rounded-xl ">
            {agenda.activity_time}
          </p>
        </div>
        <div className="w-full flex items-start justify-start flex-col gap-y-2 min-h-50 pb-5  border-b mb-10">
          <span className="text-base font-bold">Informasi Lainnya</span>
          <div className="flex items-start flex-col justify-start border p-2 rounded-xl gap-y-2.5">
            <Link
              id="link"
              href={
                agenda.on.toString() === "1"
                  ? agenda.location_url!
                  : agenda.via_link!
              }
              className="font-normal text-xs flex items-center justify-start gap-x-1 text-blue-900 wrap-anywhere"
            >
              <LinkIcon className="size-4" />
              {agenda.on.toString() === "1"
                ? `Link Google Map - ${agenda.location_url}`
                : `Link App - ${agenda.via_link}`}
            </Link>
            <span className="font-normal text-xs flex items-center justify-start gap-x-1">
              <Home className="size-4" /> {agenda.kalangan_name}
            </span>
            <div className="flex w-full items-start justify-start flex-col border p-2 rounded-xl gap-y-1">
              <span className="font-normal text-xs flex items-start justify-start gap-x-1">
                <Mic className="size-4" /> Pembicara
              </span>
              <p className="whitespace-pre-line text-xs">{agenda.pembicara}</p>
            </div>
            <div className="flex w-full items-start justify-start flex-col border p-2 rounded-xl gap-y-1">
              <span className="font-normal text-xs flex items-start justify-start gap-x-1">
                <Handshake className="size-4" /> Host
              </span>
              <p className="whitespace-pre-line text-xs">
                {agenda.penyelenggara}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Content = () => {
  const [pageSemuaAgenda, setPageSemuaAgenda] = useState<number>(1);
  const [pageHariIni, setPageHariIni] = useState<number>(1);
  const [pageMingguIni, setPageMingguIni] = useState<number>(1);
  const batchContent = 12;

  const focusTab = useAgendas((state) => state.focusTab);
  const setFocusTab = useAgendas((state) => state.setFocusTab);

  const semuaAgenda = useQuery<
    ApiResponse<
      Prisma.AgendaGetPayload<{
        include: {
          user_relation: true;
        };
      }>[]
    >
  >({
    queryKey: [
      "agenda",
      "semuaAgenda",
      {
        batchContent,
        pageSemuaAgenda,
      },
    ],
    queryFn: () =>
      apiFetch("/api/query/agenda/getSomeAgendas", {
        method: "POST",
        body: JSON.stringify({ batch: batchContent, page: pageSemuaAgenda }),
      }).then((e) => e.json()),
    enabled: focusTab === "Semua",
  });

  const hariIni = useQuery<
    ApiResponse<Prisma.AgendaGetPayload<{ include: { user_relation: true } }>[]>
  >({
    queryKey: ["agenda", "hariIni", { batchContent, pageHariIni }],
    queryFn: () =>
      apiFetch("/api/query/agenda/getAgendaHariIni", {
        method: "POST",
        body: JSON.stringify({
          batch: batchContent,
          page: pageHariIni,
        }),
      }).then((e) => e.json()),
    enabled: focusTab === "Hari Ini",
  });

  const mingguIni = useQuery<
    ApiResponse<Prisma.AgendaGetPayload<{ include: { user_relation: true } }>[]>
  >({
    queryKey: ["agenda", "mingguIni", { batchContent, pageMingguIni }],
    queryFn: () =>
      apiFetch("/api/query/agenda/getAgendaMingguIni", {
        method: "POST",
        body: JSON.stringify({
          batch: batchContent,
          page: pageMingguIni,
        }),
      }).then((e) => e.json()),
    enabled: focusTab === "Minggu Ini",
  });

  return (
    <div className="w-full flex flex-col border-t md:w-[1080px] max-w-[1080px]">
      <div className="shrink-0 flex mb-8">
        <Tab onClick={() => setFocusTab("Semua")} focusTab={focusTab}>
          Semua
        </Tab>
        <Tab onClick={() => setFocusTab("Hari Ini")} focusTab={focusTab}>
          Hari Ini
        </Tab>
        <Tab onClick={() => setFocusTab("Minggu Ini")} focusTab={focusTab}>
          Minggu Ini
        </Tab>
      </div>
      {focusTab === "Semua" ? (
        <ContentAgenda
          setPage={setPageSemuaAgenda}
          page={pageSemuaAgenda}
          batch={batchContent}
          contentAgenda={semuaAgenda}
        >
          Semua
        </ContentAgenda>
      ) : focusTab === "Hari Ini" ? (
        <ContentAgenda
          setPage={setPageHariIni}
          batch={batchContent}
          page={pageHariIni}
          contentAgenda={hariIni}
        >
          Hari Ini
        </ContentAgenda>
      ) : (
        focusTab === "Minggu Ini" && (
          <ContentAgenda
            setPage={setPageMingguIni}
            page={pageMingguIni}
            batch={batchContent}
            contentAgenda={mingguIni}
          >
            Minggu Ini
          </ContentAgenda>
        )
      )}
    </div>
  );
};
