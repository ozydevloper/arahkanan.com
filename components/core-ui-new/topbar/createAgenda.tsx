import { Prisma } from "@/app/generated/prisma/client";
import { ApiResponse } from "@/dtype/api_response";
import { RequestAgendaCreate } from "@/dtype/request-item";
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
import { toast } from "sonner";

export const ItemLoading = () => {
  return (
    <div className="w-min flex items-center justify-center text-center py-0.5 px-4 border rounded-md">
      <Loader className="animate-spin size-5" />
    </div>
  );
};

export const ItemErorr = ({ refetch }: { refetch: UseQueryResult }) => {
  return (
    <div
      onClick={() => refetch.refetch()}
      className="w-min flex items-center justify-center text-center py-0.5 px-4 border rounded-md bg-red-600 text-white"
    >
      <RefreshCcw
        className={`${refetch.isLoading || (refetch.isRefetching && "animate-spin")}`}
      />
    </div>
  );
};

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

export const CreateAgenda = ({
  onClick,
  onCreate,
}: {
  onClick: () => void;
  onCreate: boolean;
}) => {
  const setOnCreate = useAgendas((state) => state.setOnCreate);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RequestAgendaCreate>({
    defaultValues: {
      on: "1",
      date: new Date(),
      activity_time:
        "11:00 - 11:30 Pembukaan\n11:30 - 12:45 Isi\n12:45 - 13:00 Penutupan",
      pembicara: "- Pembicara 1\n- Pembicara 2\n- Pembicara 3",
      penyelenggara: "- Penyelenggara 1\n- Penyelenggara 2\n- Penyelenggara 3",
      location_url: "https://",
      via_link: "https://",
    },
  });

  const mutationAgenda = useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch("/api/query/agenda/createAgenda", {
        method: "POST",
        body: formData,
      }).then((e) => e.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agenda"] });
    },
  });

  const onSubmit: SubmitHandler<RequestAgendaCreate> = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image") {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    mutationAgenda.mutateAsync(formData).then((e) => {
      reset();
      setOnCreate(false);
      toast("Pesan", {
        description: e.message,
        closeButton: true,
      });
    });
  };

  const queryKota = useQuery<ApiResponse<Prisma.KotaGetPayload<object>[]>>({
    queryKey: ["kota"],
    queryFn: () =>
      apiFetch("/api/query/item/kota/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: !!onCreate,
  });

  const queryBiaya = useQuery<ApiResponse<Prisma.BiayaGetPayload<object>[]>>({
    queryKey: ["biaya"],
    queryFn: () =>
      apiFetch("/api/query/item/biaya/getAllItems", {
        method: "POST",
      }).then((e) => e.json()),
    enabled: !!onCreate,
  });

  const queryKategori = useQuery<
    ApiResponse<Prisma.KategoriGetPayload<object>[]>
  >({
    queryKey: ["kategori"],
    queryFn: () =>
      apiFetch("/api/query/item/kategori/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: !!onCreate,
  });

  const queryTopik = useQuery<ApiResponse<Prisma.TopikGetPayload<object>[]>>({
    queryKey: ["topik"],
    queryFn: () =>
      apiFetch("/api/query/item/topik/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: !!onCreate,
  });

  const queryKalangan = useQuery<
    ApiResponse<Prisma.KalanganGetPayload<object>[]>
  >({
    queryKey: ["kalangan"],
    queryFn: () =>
      apiFetch("/api/query/item/kalangan/getAllItems", { method: "POST" }).then(
        (e) => e.json(),
      ),
    enabled: !!onCreate,
  });

  return (
    <div className="w-full h-fit rounded-b-2xl flex flex-col items-center justify-start bg-primary-foreground overflow-y-auto relative px-3 md:px-25 pt-10">
      <div
        onClick={onClick}
        className="p-1 fixed right-5 z-1 top-5 rounded-xl hover:bg-red-500 hover:text-red-50 active:bg-red-700 active:text-red-200 transition-all ease-in-out duration-200"
      >
        <X size={25} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-xl flex justify-start flex-col items-start gap-y-7"
      >
        <div className="my-5 flex flex-col items-start justify-start wrap-anywhere">
          <span className="text-lg font-extrabold ">Buat Acara</span>
          <p className="text-xs text-muted-foreground">
            Formulir ini digunakan untuk membuat acara. Pastikan seluruh
            informasi yang diisi valid dan sesuai. Setelah proses pembuatan
            selesai, acara akan masuk ke tab Publishing untuk menunggu
            persetujuan dari admin. Selama acara berada di tab Publishing, Anda
            masih dapat melakukan perubahan atau menghapus acara tersebut.
          </p>
        </div>
        <div className="flex items-start justify-start w-full flex-col">
          <label htmlFor="on" className={`text-sm font-bold `}>
            Pelaksanaan
          </label>
          <p className="text-xs text-muted-foreground">
            Pilih metode pelaksanaan acara. Acara dapat diselenggarakan secara
            Online melalui platform digital, atau Offline di lokasi yang telah
            ditentukan.
          </p>
          <select
            id="on"
            {...register("on")}
            className="outline-none transition-all ease-in-out duration-200 shadow-md px-3 py-1 rounded-md text-sm font-bold "
          >
            <option value={1}>Offline</option> <option value={0}>Online</option>
          </select>
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="image"
            className={`text-sm font-bold ${errors.image ? "text-red-300" : ""}`}
          >
            Gambar
          </label>
          <p className="text-xs text-muted-foreground">
            Unggah gambar yang merepresentasikan acara secara jelas dan menarik.
            Gunakan gambar dengan kualitas baik agar mudah dipahami.
          </p>
          <input
            accept="image/*"
            type="file"
            id="image"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.image ? "border-red-300 text-red-300" : ""}`}
            {...register("image", { required: true })}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="title"
            className={`text-sm font-bold ${errors.title ? "text-red-300" : ""}`}
          >
            Judul
          </label>
          <p className="text-xs text-muted-foreground">
            Masukkan judul acara yang singkat, jelas, dan mencerminkan inti
            kegiatan yang akan diselenggarakan.
          </p>
          <input
            placeholder="Isi Judul..."
            id="title"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.title ? "border-red-300 text-red-300" : ""}`}
            {...register("title", { required: true, minLength: 1 })}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="deskripsi"
            className={`text-sm font-bold ${errors.description ? "text-red-300" : ""}`}
          >
            Deskripsi
          </label>
          <p className="text-xs text-muted-foreground">
            Jelaskan detail acara secara lengkap, mencakup tujuan, gambaran umum
            kegiatan, serta informasi penting yang perlu diketahui peserta.
          </p>

          <textarea
            placeholder="Isi Deskripsi..."
            rows={5}
            id="deskripsi"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.description ? "border-red-300 text-red-300" : ""}`}
            {...register("description", { required: true, minLength: 1 })}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="date"
            className={`text-sm font-bold ${errors.date ? "text-red-300" : ""}`}
          >
            Tanggal - {formatDate(new Date(watch("date") ?? new Date()))}
          </label>
          <p className="text-xs text-muted-foreground">
            Tentukan tanggal pelaksanaan acara sesuai dengan jadwal yang telah
            direncanakan.
          </p>
          <input
            type="date"
            id="date"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.date ? "border-red-300 text-red-300" : ""}`}
            {...register("date", { required: true })}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="time"
            className={`text-sm font-bold ${errors.time ? "text-red-300" : ""}`}
          >
            Waktu Acara
          </label>
          <p className="text-xs text-muted-foreground">
            Masukkan rentang waktu pelaksanaan acara agar peserta memahami
            durasi kegiatan.
          </p>
          <div className="w-full flex items-center justify-between">
            <div className="flex-1">
              <label
                htmlFor="time"
                className={`text-sm font-bold ${errors.time_start ? "text-red-300" : ""}`}
              >
                Mulai
              </label>
              <input
                type="time"
                className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.time ? "border-red-300 text-red-300" : ""}`}
                {...register("time_start", { required: true, minLength: 1 })}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="time"
                className={`text-sm font-bold ${errors.time_end ? "text-red-300" : ""}`}
              >
                Akhir
              </label>
              <input
                type="time"
                className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.time ? "border-red-300 text-red-300" : ""}`}
                {...register("time_end", { required: true, minLength: 1 })}
              />
            </div>
          </div>
          <label
            htmlFor="activity_time"
            className={`text-sm font-bold ${errors.activity_time ? "text-red-300" : ""}`}
          >
            Kegiatan Sewaktu Acara
          </label>
          <p className="text-xs text-muted-foreground">
            Rincikan susunan kegiatan yang akan berlangsung selama acara,
            disertai waktu pelaksanaannya.
          </p>
          <textarea
            rows={5}
            placeholder="Contoh: 08:00 - 09:00 Pembukaan..."
            id="activity_time"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.activity_time ? "border-red-300 text-red-300" : ""}`}
            {...register("activity_time", { required: true, minLength: 1 })}
          />
        </div>

        {watch("on").toString() === "1" ? (
          <div className="flex items-start justify-start w-full flex-col">
            <label
              htmlFor="location_detail"
              className={`text-sm font-bold ${errors.location_detail ? "text-red-300" : ""}`}
            >
              Lokasi Acara
            </label>
            <p className="text-xs text-muted-foreground">
              Masukkan alamat lengkap tempat acara diselenggarakan agar peserta
              mengetahui lokasi pelaksanaan secara jelas.
            </p>
            <input
              placeholder="Contoh: Jln. Wijaya Kusuma, Sunter Jaya, Tanjung Priok"
              id="location_detail"
              className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.location_detail ? "border-red-300 text-red-300" : ""}`}
              {...register("location_detail", {
                required: true,
                minLength: 1,
              })}
            />
            <label
              htmlFor="location_url"
              className={`text-sm font-bold ${errors.location_url ? "text-red-300" : ""}`}
            >
              Link Google Map Acara
            </label>
            <p className="text-xs text-muted-foreground">
              Sertakan tautan Google Map untuk memudahkan peserta menemukan
              lokasi acara secara akurat.
            </p>
            <input
              placeholder="Contoh: https://google.com"
              id="location_url"
              type="url"
              className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.location_url ? "border-red-300 text-red-300" : ""}`}
              {...register("location_url", { required: true, minLength: 1 })}
            />
            <label
              htmlFor="kota"
              className="text-sm font-bold flex items-start justify-start text-center"
            >
              Kota Acara - <RefetchItem onClickRefetch={queryKota} />
            </label>
            <p className="text-xs text-muted-foreground">
              Pilih atau masukkan nama kota tempat acara berlangsung.
            </p>
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
            <p className="text-xs text-muted-foreground">
              Masukkan aplikasi atau platform yang akan digunakan untuk
              pelaksanaan acara secara daring, seperti Zoom, Google Meet, atau
              platform lainnya.
            </p>
            <input
              placeholder="Contoh: Zoom, Google Meet..."
              id="via_name"
              className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.via_name ? "border-red-300 text-red-300" : ""}`}
              {...register("via_name", { required: true, minLength: 1 })}
            />
            <label
              htmlFor="via_link"
              className={`text-sm font-bold ${errors.via_link ? "text-red-300" : ""}`}
            >
              Link Aplikasi Online
            </label>
            <p className="text-xs text-muted-foreground">
              Masukkan tautan akses ke aplikasi online yang akan digunakan agar
              peserta dapat bergabung ke acara dengan mudah.
            </p>
            <input
              placeholder="Contoh: https://google.com"
              id="via_link"
              type="url"
              className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.via_link ? "border-red-300 text-red-300" : ""}`}
              {...register("via_link", { required: true, minLength: 1 })}
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
          <p className="text-xs text-muted-foreground">
            Cantumkan nama pembicara utama atau tokoh yang akan menjadi
            narasumber dalam acara ini.
          </p>
          <textarea
            placeholder="Contoh: - Nama Pembicara 1"
            rows={5}
            id="pembicara"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.pembicara ? "border-red-300 text-red-300" : ""}`}
            {...register("pembicara", { required: true, minLength: 1 })}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="penyelenggara"
            className={`text-sm font-bold ${errors.penyelenggara ? "text-red-300" : ""}`}
          >
            Penyelenggara Acara
          </label>
          <p className="text-xs text-muted-foreground">
            Masukkan nama pihak yang menyelenggarakan atau mendukung acara.
          </p>
          <textarea
            placeholder="Contoh: - Nama Penyelenggara 1"
            rows={5}
            id="penyelenggara"
            className={`outline-none border p-3 rounded-xl text-xs w-full ${errors.penyelenggara ? "border-red-300 text-red-300" : ""}`}
            {...register("penyelenggara", { required: true, minLength: 1 })}
          />
        </div>

        <div className="flex items-start justify-start w-full flex-col">
          <label
            htmlFor="biaya"
            className="text-sm font-bold flex items-start justify-start text-center"
          >
            Biaya Acara - <RefetchItem onClickRefetch={queryBiaya} />
          </label>
          <p className="text-xs text-muted-foreground">
            Pilih biaya pendaftaran acara sesuai opsi yang tersedia, seperti
            gratis atau berbayar.
          </p>
          {queryBiaya.isLoading || queryBiaya.isRefetching ? (
            <ItemLoading />
          ) : queryBiaya.isError ? (
            <ItemErorr refetch={queryBiaya} />
          ) : (
            queryBiaya.isSuccess && (
              <select
                id="biaya"
                className="outline-none transition-all ease-in-out duration-200 shadow-md px-3 py-1 rounded-md text-xs"
                {...register("biaya_name", { required: true })}
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
          <p className="text-xs text-muted-foreground">
            Tentukan kategori acara agar mudah dikelompokkan dan ditemukan oleh
            calon peserta.
          </p>
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
          <p className="text-xs text-muted-foreground">
            Masukkan topik utama yang akan dibahas dalam acara sesuai dengan
            tema kegiatan.
          </p>
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
          <p className="text-xs text-muted-foreground">
            Tentukan sasaran peserta acara, misalnya pelajar, mahasiswa,
            profesional, atau umum.
          </p>
          {queryKalangan.isLoading || queryKalangan.isRefetching ? (
            <ItemLoading />
          ) : queryKalangan.isError ? (
            <ItemErorr refetch={queryKalangan} />
          ) : (
            queryKalangan.isSuccess && (
              <select
                id="Kalangan"
                className="outline-none transition-all ease-in-out duration-200 shadow-md px-3 py-1 rounded-md text-xs"
                {...register("kalangan_name", { required: true })}
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

        <div className="w-full flex flex-col items-center justify-center text-center mb-10 ">
          <button
            disabled={mutationAgenda.isPending}
            type="submit"
            className={`w-full mb-2 flex item-center justify-center text-center p-3  rounded-2xl border-2 cursor-pointer shadow-md font-extrabold transition-all ease-in-out duration-200 bg-primary text-white`}
          >
            {mutationAgenda.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              "Buat"
            )}
          </button>
          <p className="text-xs text-muted-foreground">
            Gunakan tombol Submit untuk menyimpan dan mengajukan acara. Setelah
            dikirim, acara akan masuk ke tab Publishing dan menunggu persetujuan
            dari admin.
          </p>
        </div>
      </form>
    </div>
  );
};
