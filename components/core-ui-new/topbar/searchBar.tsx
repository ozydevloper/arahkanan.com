import { FilterIcon, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ClassNameValue } from "tailwind-merge";
import { Portal } from "../portal";
import LogoApp from "../logo-app";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/dtype/api_response";
import { Prisma } from "@/app/generated/prisma/client";
import { apiFetch } from "@/lib/signature";
import { ContentAgenda } from "../content/content";
import { SubmitHandler, useForm } from "react-hook-form";
import { RequestAgendaSearch } from "@/dtype/request-item";
import { ItemErorr, ItemLoading } from "./createAgenda";

export default function SearchBar({
  className,
}: {
  className?: ClassNameValue;
}) {
  const [onSearch, setOnSearch] = useState(false);
  const [onFilter, setOnFilter] = useState(false);

  const [pageSearch, setPageSearch] = useState(1);
  const [payload, setPayload] = useState<
    Omit<RequestAgendaSearch, "page" | "batch">
  >({
    biaya_name: null,
    date: null,
    kalangan_name: null,
    kategori_name: null,
    kota_name: null,
    on: null,
    title: null,
    topik_name: null,
  });
  const batchContent = 12;

  const {
    register,
    handleSubmit,
    formState: { submitCount },
    reset,
  } = useForm<Omit<RequestAgendaSearch, "page" | "batch">>({
    defaultValues: {
      biaya_name: null,
      date: null,
      kalangan_name: null,
      kategori_name: null,
      kota_name: null,
      on: null,
      title: null,
      topik_name: null,
    },
  });

  const queryAgendaCari = useQuery<
    ApiResponse<Prisma.AgendaGetPayload<object>[]>
  >({
    queryKey: [
      "agendaCari",
      {
        batch: batchContent,
        page: pageSearch,
        ...payload,
      },
    ],
    queryFn: () =>
      apiFetch("/api/query/agenda/getAgendaSearch", {
        method: "POST",
        body: JSON.stringify({
          batch: batchContent,
          page: pageSearch,
          ...payload,
        }),
      }).then((e) => e.json()),
    enabled: onSearch && submitCount > 0,
  });

  const onSubmit: SubmitHandler<Omit<RequestAgendaSearch, "page" | "batch">> = (
    data,
  ) => {
    data.title = !!data.title
      ? data.title.trim() !== ""
        ? data.title.trim()
        : null
      : null;

    setPayload(data);
    queryAgendaCari.refetch();
  };

  useEffect(() => {
    const handleCloseFilter = (e: PointerEvent) => {
      if ((e.target as HTMLElement).id === "back") {
        setOnFilter(false);
      }
    };
    window.addEventListener("click", handleCloseFilter);
    return () => document.removeEventListener("click", handleCloseFilter);
  }, []);

  const queryKalangan = useQuery<
    ApiResponse<Prisma.KalanganGetPayload<object>[]>
  >({
    queryKey: ["kalangan"],
    queryFn: () =>
      apiFetch("/api/query/item/kalangan/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: onFilter,
  });

  const queryKota = useQuery<ApiResponse<Prisma.KotaGetPayload<object>[]>>({
    queryKey: ["kota"],
    queryFn: () =>
      apiFetch("/api/query/item/kota/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: onFilter,
  });

  const queryKategori = useQuery<
    ApiResponse<Prisma.KategoriGetPayload<object>[]>
  >({
    queryKey: ["kategori"],
    queryFn: () =>
      apiFetch("/api/query/item/kategori/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: onFilter,
  });

  const queryTopik = useQuery<ApiResponse<Prisma.TopikGetPayload<object>[]>>({
    queryKey: ["topik"],
    queryFn: () =>
      apiFetch("/api/query/item/topik/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: onFilter,
  });

  const queryBiaya = useQuery<ApiResponse<Prisma.TopikGetPayload<object>[]>>({
    queryKey: ["biaya"],
    queryFn: () =>
      apiFetch("/api/query/item/biaya/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: onFilter,
  });

  return (
    <>
      <div
        onClick={() => setOnSearch(true)}
        className={`text-xs border-2 flex items-center justify-start text-start shadow-xs rounded-3xl px-5 py-2 gap-x-1 text-muted-foreground hover:shadow-md ${className} transition-all ease-in-out duration-200 cursor-pointer pl-3 hover:bg-blue-50 active:bg-blue-100`}
      >
        <Search size={14} /> Cari Agenda
      </div>
      <Portal typeFor="search" onOpen={onSearch} show="top">
        <div className="w-full h-full px-5 bg-primary-foreground pt-2 flex flex-col items-center justify-start overflow-y-auto">
          <div className="p-1.5  rounded-xl flex items-center justify-between w-full ">
            <LogoApp />
            <div
              onClick={() => setOnSearch(false)}
              className="active:text-white active:bg-red-500 hover:text-red-500 transition-colors ease-in-out duration-200 p-1.5 rounded-xl"
            >
              <X className="size-5" />
            </div>
          </div>
          <span className="text-lg font-extrabold pt-10 pb-5">Cari Acara</span>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex gap-x-2 md:w-xl"
          >
            <input
              placeholder="Cari judul..."
              className="text-xs border p-2 rounded-2xl flex-1"
              {...register("title")}
            />
            <button type="submit">
              <Search size={14} />
            </button>
            <div
              id="back"
              className={`inset-0 bg-black/25 transition-all ease-in-out duration-200 z-20 flex items-end justify-center ${onFilter ? "absolute" : "hidden"}`}
            >
              <div className="w-full max-w-md rounded-t-xl border shadow bg-white flex flex-col justify-center items-start px-5 py-10">
                <div className="mb-5 flex items-center justify-start gap-x-3">
                  <span className="text-2xl font-bold">Filter</span>
                  <span
                    onClick={() => reset()}
                    className="text-xs font-bold px-1 py-0.5 bg-red-500 text-white rounded-md "
                  >
                    reset
                  </span>
                </div>

                <div className="w-full grid grid-cols-2 text-xs gap-y-5">
                  <div className="flex flex-col items-start justify-center gap-y-1">
                    <label className="font-bold text-sm" htmlFor="date">
                      Tanggal
                    </label>
                    <input id="date" type="date" {...register("date")} />
                  </div>
                  <div className="flex flex-col items-start justify-center gap-y-1">
                    <label className="font-bold text-sm" htmlFor="kalangan">
                      Kalangan
                    </label>
                    {queryKalangan.isLoading ? (
                      <ItemLoading />
                    ) : queryKalangan.isError ? (
                      <ItemErorr refetch={queryKalangan} />
                    ) : (
                      queryKalangan.isSuccess && (
                        <select {...register("kalangan_name")} id="kalangan">
                          <option value={""}>Pilih kalangan</option>
                          {queryKalangan.data.data.data.map((e, i) => (
                            <option value={e.name} key={i}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      )
                    )}
                  </div>
                  <div className="flex flex-col items-start justify-center gap-y-1">
                    <label className="font-bold text-sm" htmlFor="kota">
                      Kota
                    </label>
                    {queryKota.isLoading ? (
                      <ItemLoading />
                    ) : queryKota.isError ? (
                      <ItemErorr refetch={queryKota} />
                    ) : (
                      queryKota.isSuccess && (
                        <select {...register("kota_name")} id="kota">
                          <option value={""}>Pilih kota</option>
                          {queryKota.data.data.data.map((e, i) => (
                            <option value={e.name} key={i}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      )
                    )}
                  </div>
                  <div className="flex flex-col items-start justify-center gap-y-1">
                    <label className="font-bold text-sm" htmlFor="on">
                      Online / Offline
                    </label>
                    <select {...register("on")} id="on">
                      <option value={""}>Pilih opsi</option>
                      <option value={"0"}>Online</option>
                      <option value={"1"}>Offline</option>
                    </select>
                  </div>
                  <div className="flex flex-col items-start justify-center gap-y-1">
                    <label className="font-bold text-sm" htmlFor="kategori">
                      Kategori
                    </label>
                    {queryKategori.isLoading ? (
                      <ItemLoading />
                    ) : queryKategori.isError ? (
                      <ItemErorr refetch={queryKategori} />
                    ) : (
                      queryKategori.isSuccess && (
                        <select {...register("kategori_name")} id="kategori">
                          <option value={""}>Pilih kategori</option>
                          {queryKategori.data.data.data.map((e, i) => (
                            <option value={e.name} key={i}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      )
                    )}
                  </div>
                  <div className="flex flex-col items-start justify-center gap-y-1">
                    <label className="font-bold text-sm" htmlFor="topik">
                      Topik
                    </label>
                    {queryTopik.isLoading ? (
                      <ItemLoading />
                    ) : queryTopik.isError ? (
                      <ItemErorr refetch={queryTopik} />
                    ) : (
                      queryTopik.isSuccess && (
                        <select {...register("topik_name")} id="topik">
                          <option value={""}>Pilih topik</option>
                          {queryTopik.data.data.data.map((e, i) => (
                            <option value={e.name} key={i}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      )
                    )}
                  </div>
                  <div className="flex flex-col items-start justify-center gap-y-1">
                    <label className="font-bold text-sm" htmlFor="biaya">
                      Biaya
                    </label>
                    {queryBiaya.isLoading ? (
                      <ItemLoading />
                    ) : queryBiaya.isError ? (
                      <ItemErorr refetch={queryBiaya} />
                    ) : (
                      queryBiaya.isSuccess && (
                        <select {...register("biaya_name")} id="biaya">
                          <option value={""}>Pilih biaya</option>
                          {queryBiaya.data.data.data.map((e, i) => (
                            <option value={e.name} key={i}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      )
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full col-span-2 bg-primary text-white py-2 rounded-xl font-bold"
                    onClick={() => setOnFilter(!onFilter)}
                  >
                    Cocokkan
                  </button>
                </div>
              </div>
            </div>
            <div
              onClick={() => setOnFilter(true)}
              className="px-2 border rounded-xl flex items-center justify-center text-center"
            >
              <FilterIcon className="size-3" />
            </div>
          </form>

          <div className=" w-full mt-10 md:w-[1080px] max-w-[1080px]">
            <ContentAgenda
              batch={batchContent}
              page={pageSearch}
              setPage={setPageSearch}
              contentAgenda={queryAgendaCari}
            >
              Hasil
            </ContentAgenda>
          </div>
        </div>
      </Portal>
    </>
  );
}
