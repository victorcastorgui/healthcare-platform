import { SelectSearch } from "@/types";
import { Dispatch, SetStateAction } from "react";
import Select, { SingleValue } from "react-select";

type SelectValueLabel = {
  data: SelectSearch[];
  value: SelectSearch;
  setValue: Dispatch<SetStateAction<SelectSearch | undefined>>;
  reportName: string;
  labelName?: string;
  err?: string;
};

function SearchSelectField({
  data,
  value,
  setValue,
  reportName,
  labelName,
  err = "",
}: SelectValueLabel) {
  const handleSelectChange = (e: SingleValue<SelectSearch>) => {
    if (e !== null) {
      setValue(e);
    }
  };

  return (
    <label>
      {labelName && (
        <div className="label">
          <span className="text-sm">{labelName}</span>
        </div>
      )}
      <Select
        className={`basic-single ${
          err !== "" ? "border border-solid rounded-md border-red-500" : ""
        }`}
        instanceId={value ? value.value : "selectSearch"}
        name={reportName}
        options={data}
        value={value}
        onChange={handleSelectChange}
      />
      <div className="label">
        <span className="label-text-alt text-red-500">{err}</span>
      </div>
    </label>
  );
}

export default SearchSelectField;
