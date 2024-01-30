import { apiBaseUrl } from "@/config";
import { DrugForm, SelectSearch } from "@/types";
import { useCustomSWR } from "./useCustomSWR";

export const useDrugForm = () => {
  const drugForm = useCustomSWR<DrugForm[]>(`${apiBaseUrl}/drug-forms`);

  const arrDrugForm: string[] = [];
  const objDrugForm: Record<string, number> = {};
  const selectSearchDrugForm: SelectSearch[] = [];
  if (drugForm !== undefined && drugForm.data !== undefined) {
    for (const drug of drugForm.data) {
      arrDrugForm.push(drug.name);
      objDrugForm[drug.name] = drug.id;
      selectSearchDrugForm.push({ value: drug.id, label: drug.name });
    }
  }

  return { arrDrugForm, objDrugForm, selectSearchDrugForm };
};
