import { apiBaseUrl } from "@/config";
import { Pharmacies, SelectSearch } from "@/types";
import { useCustomSWR } from "./useCustomSWR";

const useProductWPharmacies = (productId: number) => {
  const url = `${apiBaseUrl}/stock-mutations/pharmacy?pharmacy_product_id=${productId}`;
  const pharmacies = useCustomSWR<Pharmacies>(
    productId !== undefined ? url : null
  );

  const arrProductWPharmacies: string[] = [];
  const objProductWPharmacies: Record<string, number> = {};
  const selectSearchProductWPharmacies: SelectSearch[] = [];

  if (pharmacies !== undefined && pharmacies.data !== undefined) {
    for (const phar of pharmacies.data.data) {
      arrProductWPharmacies.push(phar.name);
      objProductWPharmacies[phar.name] = phar.id;
      selectSearchProductWPharmacies.push({ value: phar.id, label: phar.name });
    }
  }

  return {
    arrProductWPharmacies,
    objProductWPharmacies,
    selectSearchProductWPharmacies,
  };
};

export default useProductWPharmacies;
