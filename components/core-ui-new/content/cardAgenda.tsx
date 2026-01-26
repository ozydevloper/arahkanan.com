import { Prisma } from "@/app/generated/prisma/client";
import { formatDate } from "@/lib/formatDate";
import { useAgendas } from "@/lib/zustand";
import Image from "next/image";

export const TagItem = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: "green" | "blue" | "orange";
}) => {
  return (
    <div
      className={`border py-0.5 px-1.5 max-w-30 truncate text-[9px] rounded-xl ${color === "green" ? "bg-green-200 text-green-500 border-green-100" : color === "blue" ? "bg-primary text-white border-none" : color === "orange" ? "bg-orange-200 text-4oange-500 border-orange-100" : "bg-neutral-200 text-neutral-500 border-neutral-100"}`}
    >
      {children}
    </div>
  );
};

export const CardAgenda = ({
  agenda,
}: {
  agenda: Prisma.AgendaGetPayload<object>;
}) => {
  const setOnDetail = useAgendas((state) => state.setOnDetail);
  return (
    <div
      onClick={() => setOnDetail(agenda)}
      className=" w-full max-h-fit rounded-2xl overflow-hidden flex flex-col  hover:shadow-xl transition-all ease-in-out duration-200  relative active:shadow-xl active:scale-102 hover:scale-102"
    >
      <div className="w-full h-35 relative overflow-hidden">
        <div className="w-full absolute bottom-1 right-1 z-1 flex items-center justify-end gap-x-0.5 ">
          <TagItem color="blue">{agenda.kategori_name}</TagItem>
          <TagItem color="blue">{agenda.topik_name}</TagItem>
        </div>
        <Image
          src={agenda.image_url ?? "/lu.webp"}
          alt=".."
          fill
          className="object-cover blur-md scale-110"
        />
        <Image
          src={agenda.image_url ?? "/lu.webp"}
          alt="Foto"
          fill
          className="object-contain hover:scale-105 active:scale-105 transition-all ease-in-out duration-200"
          priority
        />
      </div>
      <div className="w-full px-3 py-1 flex flex-col gap-y-0.5">
        <span className="font-semibold text-base">{agenda.title}</span>
        <span className="font-light text-xs">
          {formatDate(new Date(agenda.date))}
        </span>
        <span className="font-light text-xs">{agenda.time}</span>
        {agenda.on.toString() === "1" && (
          <span className="font-light text-xs">{agenda.location_detail}</span>
        )}
        <div className="w-full flex gap-x-1 flex-wrap gap-y-1">
          <TagItem color="green">{agenda.biaya_name}</TagItem>
          <TagItem>{agenda.kalangan_name}</TagItem>
          <TagItem color="orange">
            {agenda.on.toString() === "1"
              ? agenda.kota_name
              : `Online - ${agenda.via_name}`}
          </TagItem>
        </div>
      </div>
    </div>
  );
};
