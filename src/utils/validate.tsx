export const validateAddress = (name: string, value: string): string => {
  switch (name) {
    case "name":
      if (value.trim().length < 3) {
        return "Name must be at least 3 characters";
      } else if (value.trim().length > 50) {
        return "Name cannot exceed 50 characters";
      } else {
        return "";
      }
    case "phone":
      return /^(?:0)[1-9]\d{10,11}$/.test(value)
        ? ""
        : "Phone number must be start with 0 and at least 10-11 char";
    case "street":
      return value.trim().length >= 20
        ? ""
        : "Address must be at least 20 characters";
    case "province_id":
      return !value.trim() || Number(value) === 0
        ? "Please select a province"
        : "";
    case "city_id":
      return !value.trim() || Number(value) === 0
        ? "Please select a cities"
        : "";
    case "postal_code":
      return value.trim().length !== 5 || value === "Choose province"
        ? "Postal code must be 5 char and number"
        : "";
    default:
      return "";
  }
};

export const validatePharmacies = (
  name: string,
  value: string | string[]
): string => {
  if (name !== "operational_day") {
    value = String(value);
    switch (name) {
      case "name":
        if (value.trim().length < 3) {
          return "Name must be at least 3 characters";
        } else if (value.trim().length > 50) {
          return "Name cannot exceed 50 characters";
        } else {
          return "";
        }
      case "pharmacist_phone_number":
        return /^(?:0)[1-9]\d{10,11}$/.test(value)
          ? ""
          : "Phone number must be start with 0 and at least 10-11 char";
      case "address":
        return value.trim().length >= 15
          ? ""
          : "Address must be at least 15 characters";
      case "province_id":
        return !value.trim() ||
          Number(value) === 0 ||
          value === "Choose province"
          ? "Please select a province"
          : "";
      case "city_id":
        return !value.trim() || Number(value) === 0 || value === "Choose city"
          ? "Please select a city"
          : "";
      case "start_time":
        return !value.trim() ? "Input is required" : "";
      case "end_time":
        return !value.trim() ? "Input is required" : "";
      case "pharmacist_license_number":
        return !value.trim() ? "Input is required" : "";
      default:
        return "";
    }
  }

  if (name === "operational_day") {
    return value.length > 0 ? "" : "Input is required";
  }

  return "";
};

export const validateSickLeave = (name: string, value: string): string => {
  switch (name) {
    case "start_date":
      return value.trim() !== "" ? "" : "Input required";
    case "end_date":
      return value.trim() !== "" ? "" : "Input required";
    case "diagnosa":
      return value.trim().length >= 8
        ? ""
        : "Input must be at least 8 characters";
    default:
      return "";
  }
};
