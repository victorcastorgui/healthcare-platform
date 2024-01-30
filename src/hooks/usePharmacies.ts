import { apiBaseUrl } from "@/config";
import { Pharmacies, SelectSearch } from "@/types";
import { useCustomSWR } from "./useCustomSWR";

const usePharmacies = (role: string) => {
  let customUrl;
  switch (role) {
    case "super":
      customUrl = "pharmacies/super-admin";
      break;
    case "pharmacy":
      customUrl = "pharmacies";
      break;
  }
  const pharmacies = useCustomSWR<Pharmacies>(`${apiBaseUrl}/${customUrl}`);

  const arrPharmacies: string[] = [];
  const objPharmacies: Record<string, number> = {};
  const selectSearchPharmacies: SelectSearch[] = [];

  if (pharmacies !== undefined && pharmacies.data !== undefined) {
    for (const phar of pharmacies.data.data) {
      arrPharmacies.push(phar.name);
      objPharmacies[phar.name] = phar.id;
      selectSearchPharmacies.push({ value: phar.id, label: phar.name });
    }
  }

  return { arrPharmacies, objPharmacies, selectSearchPharmacies };
};

export default usePharmacies;
