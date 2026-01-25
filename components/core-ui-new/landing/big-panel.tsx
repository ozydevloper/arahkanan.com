import { Prisma } from "@/app/generated/prisma/client";
import { ApiResponse } from "@/dtype/api_response";
import { UseQueryResult } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";

export const BigPanel = ({
  banner,
}: {
  banner: UseQueryResult<ApiResponse<Prisma.BannerGetPayload<object>>>;
}) => {
  return (
    <div className="items-center justify-center flex">
      <div className="w-full md:w-[1200px] h-[130px] md:h-[400px] relative md:rounded-2xl  overflow-hidden">
        {banner.isLoading || banner.isRefetching ? (
          <div className="w-full h-full bg-primary/25 animate-pulse flex items-center justify-center">
            <RefreshCcw className="size-5 animate-spin" />
          </div>
        ) : banner.isError || !banner.data?.success ? (
          <div
            onClick={() => banner.refetch()}
            className="w-full h-full flex items-center justify-center border md:rounded-2xl"
          >
            <RefreshCcw className="size-5 text-red-500" />
          </div>
        ) : (
          banner.isSuccess &&
          banner.data.success && (
            <>
              <Image
                src={banner.data.data.data.image_url ?? "/lan.webp"}
                alt=".."
                fill
                className="object-center blur-md scale-110"
                priority={false}
              />
              <Image
                src={banner.data.data.data.image_url ?? "/lan.webp"}
                alt="..."
                fill
                className="object-contain"
                priority
              />
            </>
          )
        )}
      </div>
    </div>
  );
};
