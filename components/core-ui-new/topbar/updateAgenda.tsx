"use client";
import { Prisma } from "@/app/generated/prisma/client";
import { ApiResponse } from "@/dtype/api_response";
import { RequestAgendaUpdate } from "@/dtype/request-item";
import { formatDate } from "@/lib/formatDate";
import { apiFetch } from "@/lib/signature";
import {
  useQuery,
  UseQueryResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader, RefreshCcw, X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAgendas } from "@/lib/zustand";
import { ItemErorr, ItemLoading } from "./createAgenda";
import { toast } from "sonner";

const RefetchItem = ({
  onClickRefetch,
}: {
  onClickRefetch: UseQueryResult;
}) => {
  return (
    <div
      aria-disabled={onClickRefetch.isRefetching || onClickRefetch.isLoading}
      onClick={() => onClickRefetch.refetch()}
      className={` p-1`}
    >
      <RefreshCcw
        className={`size-3 ${onClickRefetch.isRefetching || onClickRefetch.isLoading ? "animate-spin" : ""}`}
      />
    </div>
  );
};

export const UpdateAgenda = ({
  agenda,
}: {
  agenda: Prisma.AgendaGetPayload<{
    include: {
      user_relation: true;
    };
  }>;
}) => {
  const setOnUpdate = useAgendas((state) => state.setOnUpadate);
  const setOnDetail = useAgendas((state) => state.setOnDetail);
  const onUpdate = useAgendas((state) => state.onUpdate);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RequestAgendaUpdate>({
    defaultValues: {
      id: agenda.id,
      on: agenda.on,
      date: new Date(agenda.date),
      description: agenda.description,

      image_public_id: agenda.image_public_id,

      time: agenda.time,
      activity_time: agenda.activity_time,

      biaya_name: agenda.biaya_name,
      kalangan_name: agenda.kalangan_name,
      kategori_name: agenda.kategori_name,
      kota_name: agenda.kota_name,
      location_detail: agenda.location_detail,
      location_url: agenda.location_url,
      pembicara: agenda.pembicara,
      penyelenggara: agenda.penyelenggara,
      title: agenda.title,
      topik_name: agenda.topik_name,
      via_link: agenda.via_link,
      via_name: agenda.via_name,

      published: agenda.published ? "1" : "0",
    },
  });

  const queryClient = useQueryClient();

  const mutationAgenda = useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch("/api/query/agenda/updateAgenda", {
        method: "PUT",
        body: formData,
      }).then((e) => e.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agenda"] });
    },
  });

  const onSubmit: SubmitHandler<RequestAgendaUpdate> = (data) => {
    const formData = new FormData();
    formData.append("user_id", agenda.user_relation.id);
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
        if (!!value[0]) {
          formData.append(key, value[0]);
        }
      } else {
        formData.append(key, value);
      }
    });

    mutationAgenda.mutateAsync(formData).then((e) => {
      setOnUpdate(null);
      setOnDetail(null);
      toast("Pesan", { description: e.message, closeButton: true });
    });
  };

  const queryKota = useQuery<ApiResponse<Prisma.KotaGetPayload<object>[]>>({
    queryKey: ["kota"],
    queryFn: () =>
      apiFetch("/api/query/item/kota/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: !!onUpdate,
  });

  const queryBiaya = useQuery<ApiResponse<Prisma.BiayaGetPayload<object>[]>>({
    queryKey: ["biaya"],
    queryFn: () =>
      apiFetch("/api/query/item/biaya/getAllItems", {
        method: "POST",
      }).then((e) => e.json()),
    enabled: !!onUpdate,
  });

  const queryKategori = useQuery<
    ApiResponse<Prisma.KategoriGetPayload<object>[]>
  >({
    queryKey: ["kategori"],
    queryFn: () =>
      apiFetch("/api/query/item/kategori/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: !!onUpdate,
  });

  const queryTopik = useQuery<ApiResponse<Prisma.TopikGetPayload<object>[]>>({
    queryKey: ["topik"],
    queryFn: () =>
      apiFetch("/api/query/item/topik/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: !!onUpdate,
  });

  const queryKalangan = useQuery<
    ApiResponse<Prisma.KalanganGetPayload<object>[]>
  >({
    queryKey: ["kalangan"],
    queryFn: () =>
      apiFetch("/api/query/item/kalangan/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: !!onUpdate,
  });

  return (
    <div className="w-full h-fit rounded-b-2xl flex flex-col items-center justify-start bg-primary-foreground overflow-y-auto relative px-3 md:px-25 pt-10">
      <div
        onClick={() => setOnUpdate(null)}
        className="p-1 fixed right-5 z-1 top-5 rounded-xl hover:bg-red-500 hover:text-red-50 active:bg-red-700 active:text-red-200 transition-all ease-in-out duration-200"
      >
        <X size={25} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-xl flex justify-start flex-col items-start gap-y-7"
      >
        <span className="text-lg font-extrabold my-5">Update Acara</span>
        <div className="flex items-start justify-start w-full flex-col">
          <label htmlFor="published" className={`text-sm font-bold `}>
            Publish
          </label>
          <select
            id="published"
            {...register("published")}
            className="outline-none transition-all ease-in-out duration-200 shadow-md px-3 py-1 rounded-md text-sm font-bold "
          >
            <option value={"0"}>Jangan Publish</option>{" "}
            <option value={"1"}>Publish</option>
          </select>
        </div>
        <div className="flex items-start justify-start w-full flex-col">
          <label htmlFor="on" className={`text-sm font-bold `}>
            Pelaksanaan
          </label>
          <select
            id="on"
            {...register("on")}
            className="outline-none transition-all ease-in-out duration-200 shadow-md px-3 py-1 rounded-md text-sm font-bold "
          >
            <option value={"1"}>Offline</option>{" "}
            <option value={"0"}>Online</option>
          </select>
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="image"
            className={`text-sm font-bold ${errors.image ? "text-red-300" : ""}`}
          >
            Gambar
          </label>

          <input
            accept="image/*"
            type="file"
            id="image"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.image ? "border-red-300 text-red-300" : ""}`}
            {...register("image")}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="title"
            className={`text-sm font-bold ${errors.title ? "text-red-300" : ""}`}
          >
            Judul
          </label>

          <input
            placeholder="Isi Judul..."
            id="title"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.title ? "border-red-300 text-red-300" : ""}`}
            {...register("title", { minLength: 1 })}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="deskripsi"
            className={`text-sm font-bold ${errors.description ? "text-red-300" : ""}`}
          >
            Deskripsi
          </label>
          <textarea
            placeholder="Isi Deskripsi..."
            rows={5}
            id="deskripsi"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.description ? "border-red-300 text-red-300" : ""}`}
            {...register("description", { minLength: 1 })}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="date"
            className={`text-sm font-bold ${errors.date ? "text-red-300" : ""}`}
          >
            Tanggal - {formatDate(new Date(watch("date") ?? ""))}
          </label>
          <input
            type="date"
            id="date"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.date ? "border-red-300 text-red-300" : ""}`}
            {...register("date")}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="time"
            className={`text-sm font-bold ${errors.time ? "text-red-300" : ""}`}
          >
            Waktu Acara
          </label>
          <input
            placeholder="Contoh: 08:00 - 09:00 WIB"
            id="time"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.time ? "border-red-300 text-red-300" : ""}`}
            {...register("time", { minLength: 1 })}
          />
          <label
            htmlFor="activity_time"
            className={`text-sm font-bold ${errors.activity_time ? "text-red-300" : ""}`}
          >
            Kegiatan Sewaktu Acara
          </label>
          <textarea
            rows={5}
            placeholder="Contoh: 08:00 - 09:00 Pembukaan..."
            id="activity_time"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.activity_time ? "border-red-300 text-red-300" : ""}`}
            {...register("activity_time", { minLength: 1 })}
          />
        </div>

        {watch("on")!.toString() === "1" ? (
          <div className="flex items-start justify-start w-full flex-col">
            <label
              htmlFor="location_detail"
              className={`text-sm font-bold ${errors.location_detail ? "text-red-300" : ""}`}
            >
              Lokasi Acara
            </label>
            <input
              placeholder="Contoh: Jln. Wijaya Kusuma, Sunter Jaya, Tanjung Priok"
              id="location_detail"
              className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.location_detail ? "border-red-300 text-red-300" : ""}`}
              {...register("location_detail", {
                minLength: 1,
              })}
            />
            <label
              htmlFor="location_url"
              className={`text-sm font-bold ${errors.location_url ? "text-red-300" : ""}`}
            >
              Link Google Map Acara
            </label>
            <input
              placeholder="Contoh: https://google.com"
              id="location_url"
              type="url"
              className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.location_url ? "border-red-300 text-red-300" : ""}`}
              {...register("location_url", { minLength: 1 })}
            />
            <label
              htmlFor="kota"
              className="text-sm font-bold flex items-start justify-start text-center"
            >
              Kota Acara - <RefetchItem onClickRefetch={queryKota} />
            </label>
            {queryKota.isLoading || queryKota.isRefetching ? (
              <ItemLoading />
            ) : queryKota.isError ? (
              <ItemErorr refetch={queryKota} />
            ) : (
              queryKota.isSuccess && (
                <select
                  id="kota"
                  className="outline-none transition-all ease-in-out duration-200 shadow-md px-3 py-1 rounded-md text-xs"
                  {...register("kota_name")}
                >
                  {queryKota.data.data.data.map((kota, i) => (
                    <option key={i} value={kota.name}>
                      {kota.name}
                    </option>
                  ))}
                </select>
              )
            )}
          </div>
        ) : (
          <div className="flex items-start justify-start w-full flex-col">
            <label
              htmlFor="via_name"
              className={`text-sm font-bold ${errors.via_name ? "text-red-300" : ""}`}
            >
              Aplikasi Online
            </label>
            <input
              placeholder="Contoh: Zoom, Google Meet..."
              id="via_name"
              className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.via_name ? "border-red-300 text-red-300" : ""}`}
              {...register("via_name", { minLength: 1 })}
            />
            <label
              htmlFor="via_link"
              className={`text-sm font-bold ${errors.via_link ? "text-red-300" : ""}`}
            >
              Link Aplikasi Online
            </label>
            <input
              placeholder="Contoh: https://google.com"
              id="via_link"
              type="url"
              className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.via_link ? "border-red-300 text-red-300" : ""}`}
              {...register("via_link", { minLength: 1 })}
            />
          </div>
        )}

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="pembicara"
            className={`text-sm font-bold ${errors.pembicara ? "text-red-300" : ""}`}
          >
            Pembicara Acara
          </label>
          <textarea
            placeholder="Contoh: - Nama Pembicara 1"
            rows={5}
            id="pembicara"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.pembicara ? "border-red-300 text-red-300" : ""}`}
            {...register("pembicara", { minLength: 1 })}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="penyelenggara"
            className={`text-sm font-bold ${errors.penyelenggara ? "text-red-300" : ""}`}
          >
            Penyelenggara Acara
          </label>
          <textarea
            placeholder="Contoh: - Nama Penyelenggara 1"
            rows={5}
            id="penyelenggara"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.penyelenggara ? "border-red-300 text-red-300" : ""}`}
            {...register("penyelenggara", { minLength: 1 })}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="biaya"
            className="text-sm font-bold flex items-start justify-start text-center"
          >
            Biaya Acara - <RefetchItem onClickRefetch={queryBiaya} />
          </label>
          {queryBiaya.isLoading || queryBiaya.isRefetching ? (
            <ItemLoading />
          ) : queryBiaya.isError ? (
            <ItemErorr refetch={queryBiaya} />
          ) : (
            queryBiaya.isSuccess && (
              <select
                id="biaya"
                className="outline-none transition-all ease-in-out duration-200 shadow-md px-3 py-1 rounded-md text-xs"
                {...register("biaya_name")}
              >
                {queryBiaya.data.data.data.map((biaya, i) => (
                  <option key={i} value={biaya.name}>
                    {biaya.name}
                  </option>
                ))}
              </select>
            )
          )}
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="kategori"
            className="text-sm font-bold flex items-start justify-start text-center"
          >
            Kategori Acara - <RefetchItem onClickRefetch={queryKategori} />
          </label>
          {queryKategori.isLoading || queryKategori.isRefetching ? (
            <ItemLoading />
          ) : queryKategori.isError ? (
            <ItemErorr refetch={queryKategori} />
          ) : (
            queryKategori.isSuccess && (
              <select
                id="kategori"
                className="outline-none transition-all ease-in-out duration-200 shadow-md px-3 py-1 rounded-md text-xs"
                {...register("kategori_name")}
              >
                {queryKategori.data.data.data.map((kategori, i) => (
                  <option key={i} value={kategori.name}>
                    {kategori.name}
                  </option>
                ))}
              </select>
            )
          )}
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="topik"
            className="text-sm font-bold flex items-start justify-start text-center"
          >
            Topik Acara - <RefetchItem onClickRefetch={queryTopik} />
          </label>
          {queryTopik.isLoading || queryTopik.isRefetching ? (
            <ItemLoading />
          ) : queryTopik.isError ? (
            <ItemErorr refetch={queryTopik} />
          ) : (
            queryTopik.isSuccess && (
              <select
                id="topik"
                className="outline-none transition-all ease-in-out duration-200 shadow-md px-3 py-1 rounded-md text-xs"
                {...register("topik_name")}
              >
                {queryTopik.data.data.data.map((topik, i) => (
                  <option key={i} value={topik.name}>
                    {topik.name}
                  </option>
                ))}
              </select>
            )
          )}
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="kalangan"
            className="text-sm font-bold flex items-start justify-start text-center"
          >
            kalangan Acara - <RefetchItem onClickRefetch={queryKalangan} />
          </label>
          {queryKalangan.isLoading || queryKalangan.isRefetching ? (
            <ItemLoading />
          ) : queryKalangan.isError ? (
            <ItemErorr refetch={queryKalangan} />
          ) : (
            queryKalangan.isSuccess && (
              <select
                id="Kalangan"
                className="outline-none transition-all ease-in-out duration-200 shadow-md px-3 py-1 rounded-md text-xs"
                {...register("kalangan_name")}
              >
                {queryKalangan.data.data.data.map((kalangan, i) => (
                  <option key={i} value={kalangan.name}>
                    {kalangan.name}
                  </option>
                ))}
              </select>
            )
          )}
        </div>

        <button
          disabled={mutationAgenda.isPending}
          type="submit"
          className={`mb-10 w-full bg-neutral-300 text-neutral-500 flex item-center justify-center text-center p-3  rounded-2xl border-2 cursor-pointer shadow-md font-extrabold transition-all ease-in-out duration-200 ${mutationAgenda.isPending ? "bg-primary text-white" : "hover:bg-primary hover:text-white active:bg-primary active:text-white"}`}
        >
          {mutationAgenda.isPending ? (
            <Loader className="animate-spin" />
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};
