import { apiBaseUrl } from "@/config";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import { useCustomSWR } from "./useCustomSWR";
import { spaceToUnderscore } from "@/utils/formatter/spaceToUnderscore";

export const useFilter = <T>(
  endpoint: string,
  searchParam: string,
  defaultSortTitle: string,
  customLimit: number,
  filterParam?: string,
  filterValue?: Record<string, string | number>,
  orderBy?: string
) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortTitle, setSortTitle] = useState<string>(defaultSortTitle);
  const [orderTitle, setOrderTitle] = useState<string>(
    orderBy !== undefined ? orderBy : "Asc"
  );
  const [filterTitle, setFilterTitle] = useState<string>("Show All");
  const [page, setPage] = useState<number>(1);
  const debounceSearchInput = useDebounce<string>(searchInput);

  const swrResponse = useCustomSWR<T>(
    `${apiBaseUrl}/${endpoint}?sort_by=${spaceToUnderscore(
      sortTitle
    ).toLowerCase()}&order=${orderTitle.toLowerCase()}&limit=${customLimit}&page=${page}&${searchParam}=${debounceSearchInput}${
      filterTitle !== "Show All" && filterValue !== undefined
        ? `&${filterParam}=${filterValue[filterTitle]}`
        : ""
    }`
  );

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    setPage(1);
  }, [sortTitle, orderTitle, debounceSearchInput, filterTitle]);

  return {
    searchInput,
    sortTitle,
    setSortTitle,
    orderTitle,
    setOrderTitle,
    filterTitle,
    setFilterTitle,
    page,
    setPage,
    handleSearchInput,
    swrResponse,
  };
};
