import { apiBaseUrl } from "@/config";
import { ProductList, SelectSearch } from "@/types";
import { useCustomSWR } from "./useCustomSWR";

const useProduct = (role?: "pharmacy" | undefined) => {
  let endpoint = "products";
  switch (role) {
    case "pharmacy":
      endpoint = "products/admin?is_hidden=false";
      break;
  }

  const products = useCustomSWR<ProductList>(`${apiBaseUrl}/${endpoint}`);

  const arrProduct: string[] = [];
  const objProduct: Record<string, number> = {};
  const selectSearchProduct: SelectSearch[] = [];

  if (products !== undefined && products.data !== undefined) {
    for (const prod of products.data.data) {
      arrProduct.push(prod.name);
      objProduct[prod.name] = prod.id;
      selectSearchProduct.push({ value: prod.id, label: prod.name });
    }
  }

  return { arrProduct, objProduct, selectSearchProduct };
};

export default useProduct;
