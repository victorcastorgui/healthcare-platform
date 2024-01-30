import { orderBy } from "@/lib/orderBy";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction } from "react";
import { InputField } from "../Input/InputField";
import SortOrder from "../Sort/SortOrder";

type TTable = {
  tableHeads: string[];
  children: ReactNode;
  componentBesideSearch?: ReactNode;
  searchInput: string;
  handleSearchInput: (e: ChangeEvent<HTMLInputElement>) => void;
  sortBy: string[];
  sortTitle: string;
  setOrderTitle: Dispatch<SetStateAction<string>>;
  orderTitle: string;
  setFilterTitle?: Dispatch<SetStateAction<string>>;
  filterTitle?: string;
  filterBy?: string[];
  filterSectionTitle?: string;
  searchName: string;
  setSortTitle?: Dispatch<SetStateAction<string>>;
};

const Table = ({
  tableHeads,
  children,
  componentBesideSearch,
  searchInput,
  handleSearchInput,
  sortBy,
  sortTitle,
  setOrderTitle,
  orderTitle,
  filterTitle,
  setFilterTitle,
  filterBy,
  filterSectionTitle = "",
  searchName,
  setSortTitle,
}: TTable) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row w-full justify-end gap-4 sm:items-center mt-8">
        <SortOrder
          sortBy={sortBy}
          orderBy={orderBy}
          sortTitle={sortTitle}
          setOrderTitle={setOrderTitle}
          orderTitle={orderTitle}
          filterBy={filterBy}
          filterTitle={filterTitle}
          setFilterTitle={setFilterTitle}
          setSortTitle={setSortTitle}
          filterSectionTitle={filterSectionTitle}
        />
        <div>
          <InputField
            type="text"
            variants="medium"
            name={searchName}
            placeholder={searchName}
            value={searchInput}
            onChange={handleSearchInput}
          />
        </div>
        {componentBesideSearch && (
          <div className="w-52">{componentBesideSearch}</div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-lg table-zebra bg-white mt-4">
          <thead>
            <tr>
              {tableHeads.map((head, idx) => (
                <th key={idx}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
