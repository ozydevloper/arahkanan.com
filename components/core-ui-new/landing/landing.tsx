"use client";
import { useRef, useState } from "react";
import { BigPanel } from "./big-panel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/signature";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { ApiResponse } from "@/dtype/api_response";
import { Prisma } from "@/app/generated/prisma/client";
import { useUserSession } from "@/lib/zustand";

export const Landing = () => {
  const session = useUserSession((state) => state.dataUser);

  const queryClient = useQueryClient();
  const [files, setFiles] = useState<FileList | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const queryBanner = useQuery<ApiResponse<Prisma.BannerGetPayload<object>>>({
    queryKey: ["banner"],
    queryFn: () =>
      apiFetch("/api/query/banner", {
        method: "GET",
      }).then((e) => e.json()),
  });

  const mutationUpdateBanner = useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch("/api/query/banner", {
        method: "PUT",
        body: formData,
      }).then((e) => e.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banner"] }),
  });
  return (
    <div className="flex flex-col md:px-5 md:py-2 gap-y-2 mb-5 mt-17">
      <BigPanel banner={queryBanner} />
      {session && session.role && session.role === "SUDO" && (
        <div className="flex items-center justify-start gap-x-1">
          <button
            disabled={
              !!!files ||
              mutationUpdateBanner.isPending ||
              !queryBanner.isSuccess
            }
            onClick={() => {
              if (!queryBanner.isSuccess) return;
              if (!!!files) return;
              if (files.length < 1) return;
              const formData = new FormData();
              formData.append("image", files[0]);
              formData.append("id", queryBanner.data.data.data.id);
              formData.append(
                "image_public_id",
                queryBanner.data.data.data.image_public_id,
              );
              formData.append(
                "image_url",
                queryBanner.data.data.data.image_url,
              );

              mutationUpdateBanner.mutateAsync(formData).then((e) => {
                toast("Pesan", {
                  closeButton: true,
                  description:
                    typeof e === "object" &&
                    e !== null &&
                    "message" in e &&
                    (e.message as string),
                });
              });
            }}
            className={`text-xs px-2 py-1  rounded-xl w-fit ml-2 ${!!files ? "bg-green-500 text-white" : "bg-neutral-500 text-white"}`}
          >
            {mutationUpdateBanner.isPending ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              "Update Banner"
            )}
          </button>
          <input
            ref={fileRef}
            onChange={(e) => setFiles(e.target.files)}
            placeholder=""
            className="text-[0.600rem]"
            type="file"
            accept="image/*"
          />
        </div>
      )}
    </div>
  );
};
