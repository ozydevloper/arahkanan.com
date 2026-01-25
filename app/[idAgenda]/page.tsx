import { DetailSharedId } from "@/components/core-ui-new/sharedId";
import Loading from "../loading";

export default async function Page({
  params,
}: {
  params: Promise<{
    idAgenda: string;
  }>;
}) {
  const idAgenda = (await params).idAgenda;
  return (
    <>{!!!idAgenda ? <Loading /> : <DetailSharedId idAgenda={idAgenda} />}</>
  );
}
