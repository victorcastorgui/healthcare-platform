import { apiBaseUrl } from "@/config";
import { DrugClassification, SelectSearch } from "@/types";
import { useCustomSWR } from "./useCustomSWR";

const useDrugClassification = () => {
  const drugClassification = useCustomSWR<DrugClassification[]>(
    `${apiBaseUrl}/drug-classifications`
  );

  const arrDrugClassification: string[] = [];
  const objDrugClassification: Record<string, number> = {};
  const selectSearchDrugClass: SelectSearch[] = [];
  if (
    drugClassification !== undefined &&
    drugClassification.data !== undefined
  ) {
    for (const drug of drugClassification.data) {
      arrDrugClassification.push(drug.name);
      objDrugClassification[drug.name] = drug.id;
      selectSearchDrugClass.push({ value: drug.id, label: drug.name });
    }
  }

  return {
    arrDrugClassification,
    objDrugClassification,
    selectSearchDrugClass,
  };
};

export default useDrugClassification;
