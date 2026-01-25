"use client";
import { RefreshCcw } from "lucide-react";
import LogoApp from "../logo-app";
import { UseQueryResult } from "@tanstack/react-query";
import { Prisma } from "@/app/generated/prisma/client";
import { ApiResponse } from "@/dtype/api_response";
import { CardAgenda } from "./cardAgenda";

const CardLoading = () => {
  return (
    <div className=" w-full md:w-50 md:max-w-50 min-h-60  flex flex-col gap-y-2">
      <div className="w-full h-35 bg-primary/50 animate-pulse rounded-2xl"></div>
      <div className="w-1/2 h-5 bg-primary/50 animate-pulse rounded-2xl"></div>
      <div className="w-1/3 h-5 bg-primary/50 animate-pulse rounded-2xl"></div>
      <div className="w-1/4 h-5 bg-primary/50 animate-pulse rounded-2xl"></div>
    </div>
  );
};

export const LoadingContentIcon = ({
  contentQuery,
}: {
  contentQuery: UseQueryResult;
}) => {
  return (
    <div className="p-1" onClick={() => contentQuery.refetch()}>
      <RefreshCcw
        size={12}
        className={`${contentQuery.isRefetching || contentQuery.isLoading ? "animate-spin" : ""}`}
      />
    </div>
  );
};

export const LoadingContent = () => {
  return (
    <div className="w-full flex flex-wrap items-center gap-x-10 justify-center">
      <CardLoading />
      <CardLoading />
      <CardLoading />
      <CardLoading />
      <CardLoading />
    </div>
  );
};

export const ErrorContent = ({
  contentQuery,
  children,
}: {
  contentQuery: UseQueryResult;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full h-100  rounded-2xl items-center justify-center flex flex-col gap-y-0.5">
      <LogoApp />
      <div className="text-sm font-light text-center">{children}</div>
      <div
        onClick={() => contentQuery.refetch()}
        className="text-xs font-bold text-white bg-primary rounded-2xl px-3 py-1 flex items-center justify-center gap-x-1 text-center hover:scale-101 active:scale-98 relative transition-all ease-in-out duration-200 active:text-blue-50"
      >
        Coba Refresh
        <RefreshCcw
          size={12}
          className={`${contentQuery.isRefetching || contentQuery.isLoading ? "animate-spin" : ""}`}
        />
      </div>
    </div>
  );
};

export const StateContent = ({
  contentQuery,
}: {
  contentQuery: UseQueryResult<ApiResponse<Prisma.AgendaGetPayload<object>[]>>;
}) => {
  return (
    <div className="flex flex-wrap gap-x-5 items-center gap-y-10 justify-center ">
      {contentQuery.isLoading || contentQuery.isRefetching ? (
        <LoadingContent />
      ) : contentQuery.isError ? (
        <ErrorContent contentQuery={contentQuery}>
          Terjadi kesalahan tak terduga di server!
        </ErrorContent>
      ) : !contentQuery.isSuccess ? (
        <ErrorContent contentQuery={contentQuery}>
          Mendapatkan event berhasil, tapi ada kesalahan!
        </ErrorContent>
      ) : !contentQuery.data.success ? (
        <ErrorContent contentQuery={contentQuery}>
          {contentQuery.data.message}
        </ErrorContent>
      ) : contentQuery.data.data.total === 0 ? (
        <ErrorContent contentQuery={contentQuery}>
          Sepertinya tidak ada event, coba untuk lihat-lihat yang lain
        </ErrorContent>
      ) : (
        contentQuery.data.data.data.map((agenda, i) => (
          <CardAgenda agenda={agenda} key={i} />
        ))
      )}
    </div>
  );
};
