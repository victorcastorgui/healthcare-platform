import { apiBaseUrl } from "@/config";
import { ProductPharmacy, SelectSearch } from "@/types";
import { useCustomSWR } from "./useCustomSWR";

const useProductPharmacy = (pharmacies: number) => {
  const url = `${apiBaseUrl}/pharmacies/${pharmacies}/products`;
  const products = useCustomSWR<ProductPharmacy>(
    pharmacies !== undefined ? url : null
  );

  const arrProduct: string[] = [];
  const objProduct: Record<string, number> = {};
  const selectSearchProduct: SelectSearch[] = [];

  if (products !== undefined && products.data !== undefined) {
    for (const prod of products.data.data) {
      arrProduct.push(prod.product.name);
      objProduct[prod.product.name] = prod.id;
      selectSearchProduct.push({ value: prod.id, label: prod.product.name });
    }
  }

  return { arrProduct, objProduct, selectSearchProduct };
};

export default useProductPharmacy;
