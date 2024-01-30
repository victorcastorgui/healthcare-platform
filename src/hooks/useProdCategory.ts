import { useCustomSWR } from "./useCustomSWR";
import { ProductCategory, SelectSearch } from "@/types";
import { apiBaseUrl } from "@/config";

const useProdCategory = () => {
  const prodCategory = useCustomSWR<ProductCategory>(
    `${apiBaseUrl}/product-categories`
  );

  const arrProdCategory: string[] = [];
  const objProdCategory: Record<string, number> = {};
  const objIsDrug: Record<string, boolean> = {};
  const selectSearchProdCat: SelectSearch[] = [];

  if (prodCategory !== undefined && prodCategory.data !== undefined) {
    for (const prod of prodCategory.data.data) {
      arrProdCategory.push(prod.name);
      objProdCategory[prod.name] = prod.id;
      objIsDrug[prod.id] = prod.is_drug;
      selectSearchProdCat.push({ value: prod.id, label: prod.name });
    }
  }

  return { arrProdCategory, objProdCategory, objIsDrug, selectSearchProdCat };
};

export default useProdCategory;
