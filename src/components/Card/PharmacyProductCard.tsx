import React from "react";
import BaseCard from "./BaseCard";
import Image from "next/image";
import { BaseProductDetail } from "@/types";
import { getKey } from "@/lib/getKey";
import useProdCategory from "@/hooks/useProdCategory";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";

const PharmacyProductCard = ({
  productData,
}: {
  productData: BaseProductDetail;
}) => {
  const { objProdCategory } = useProdCategory();
  return (
    <BaseCard>
      <div className="flex gap-10">
        <div className="relative w-[150px] h-[150px]">
          <Image
            src={productData.data.image}
            alt={productData.data.name}
            fill
            sizes="100%"
            priority
          />
        </div>
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-x-4 overflow-auto">
            <tbody>
              <tr>
                <td className="font-medium">Name</td>
                <td>: {productData.data.name}</td>
                <td className="font-medium">Selling Unit</td>
                <td>: {productData.data.selling_unit}</td>
              </tr>
              <tr>
                <td className="font-medium">Drug Form</td>
                <td>: {productData.data.drug_form}</td>
                <td className="font-medium">Manufacture</td>
                <td>: {productData.data.manufacture}</td>
              </tr>
              <tr>
                <td className="font-medium">Drug Classification</td>
                <td>: {productData.data.drug_classification}</td>
                <td className="font-medium">Category</td>
                <td>
                  :{" "}
                  {getKey(
                    objProdCategory,
                    productData.data.product_category_id
                  )}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Content</td>
                <td>: {productData.data.content}</td>
                <td className="font-medium">Price</td>
                <td>: {formatToRupiah(parseInt(productData.data.price))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseCard>
  );
};

export default PharmacyProductCard;
