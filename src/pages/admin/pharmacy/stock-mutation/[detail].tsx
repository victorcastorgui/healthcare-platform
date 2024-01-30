import BackButton from "@/components/Button/BackButton";
import BaseCard from "@/components/Card/BaseCard";
import AdminHeader from "@/components/Header/AdminHeader";
import OrderStatus from "@/components/Label/OrderStatus";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { StockMutationDetail } from "@/types";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

function MutationDetail() {
  const { query } = useRouter();
  const URL = `${apiBaseUrl}/stock-mutations/${query.detail}`;
  const { data: mutationDetail } = useCustomSWR<StockMutationDetail>(
    query.detail ? URL : null
  );

  return (
    <PharmacyLayout>
      <Head>
        <title>Stock Mutation Detail</title>
      </Head>
      <AdminHeader>Stock Mutation Detail</AdminHeader>
      <div className="my-8">
        <BackButton route="/admin/pharmacy/stock-mutation" />
      </div>
      {mutationDetail && (
        <BaseCard>
          <div className="flex gap-8 max-sm:flex-col justify-between">
            <div className="relative h-60 w-60">
              <Image
                src={mutationDetail?.data.form_pharmacy_product.image}
                fill
                sizes="100%"
                className="object-cover"
                alt={mutationDetail?.data.form_pharmacy_product.name}
              />
            </div>
            <div className="flex flex-col gap-4 text-xl justify-center">
              <h2 className="text-black text-2xl">
                {mutationDetail?.data.to_pharmacy_product.name}
              </h2>
              <p>{mutationDetail?.data.quantity}</p>
              <p>
                <OrderStatus status={mutationDetail?.data.status} />
              </p>
              <p>{mutationDetail?.data.mutated_at}</p>
            </div>
            <div className="flex flex-col justify-center gap-8 text-xl">
              <div className="flex flex-col">
                <h2 className="text-2xl">From</h2>
                <p>{mutationDetail.data.form_pharmacy_product.pharmacy.name}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl">To</h2>
                <p>{mutationDetail.data.to_pharmacy_product.pharmacy.name}</p>
              </div>
            </div>
          </div>
        </BaseCard>
      )}
    </PharmacyLayout>
  );
}

export default MutationDetail;
