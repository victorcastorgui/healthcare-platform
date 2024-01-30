import { Provinces, SelectSearch } from "@/types";
import { useCustomSWR } from "./useCustomSWR";
import { apiBaseUrl } from "@/config";

export const useProvince = () => {
  const arrProvinces: string[] = [];
  const objProvinces: Record<string, number> = {};
  const selectSearchProv: SelectSearch[] = [];

  const provinces = useCustomSWR<Provinces[]>(`${apiBaseUrl}/provinces`);

  if (provinces.data !== undefined) {
    for (const province of provinces.data) {
      arrProvinces.push(province.name);
      objProvinces[province.name] = province.id;
      selectSearchProv.push({ value: province.id, label: province.name });
    }
  }
  return { arrProvinces, objProvinces, selectSearchProv };
};
