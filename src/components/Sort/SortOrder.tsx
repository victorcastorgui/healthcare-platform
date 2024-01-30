import React, { Dispatch } from "react";
import DropdownButton from "@/components/Button/DropdownButton";
import Button from "@/components/Button/Button";

type TSortOrder = {
  sortBy: string[];
  orderBy: string[];
  sortTitle: string;
  setSortTitle?: Dispatch<React.SetStateAction<string>>;
  setOrderTitle: Dispatch<React.SetStateAction<string>>;
  orderTitle: string;
  filterTitle?: string;
  setFilterTitle?: Dispatch<React.SetStateAction<string>>;
  filterSectionTitle?: string;
  filterBy?: string[];
};

const SortOrder = ({
  sortBy,
  orderBy,
  sortTitle,
  setSortTitle,
  orderTitle,
  setOrderTitle,
  filterSectionTitle = "",
  filterBy,
  filterTitle,
  setFilterTitle,
}: TSortOrder) => {
  const handleOnClickItem = (item: string, condition: number) => {
    switch (condition) {
      case 1:
        if (setSortTitle) {
          setSortTitle(item);
        }
        break;
      case 2:
        setOrderTitle(item);
        break;
      case 3:
        setFilterTitle!(item);
        break;
    }
  };
  return (
    <>
      <div className="flex gap-2 items-center">
        <p>Sort by </p>
        <DropdownButton variants="bordered" dropdownTitle={sortTitle}>
          {sortBy.map((item, idx) => (
            <li key={idx}>
              <Button onClick={() => handleOnClickItem(item, 1)}>{item}</Button>
            </li>
          ))}
        </DropdownButton>
      </div>
      <div className="flex gap-2 items-center">
        <p>Order by </p>
        <DropdownButton variants="bordered" dropdownTitle={orderTitle}>
          {orderBy.map((item, idx) => (
            <li key={idx}>
              <Button onClick={() => handleOnClickItem(item, 2)}>{item}</Button>
            </li>
          ))}
        </DropdownButton>
      </div>
      {filterBy !== undefined && (
        <div className="flex gap-2 items-center">
          <p>Filter by </p>
          <DropdownButton
            variants="bordered"
            dropdownTitle={filterTitle}
            height="fixed"
          >
            <li>
              <Button onClick={() => handleOnClickItem("Show All", 3)}>
                Show All
              </Button>
            </li>
            {filterSectionTitle !== "" && (
              <h4 className="font-semibold pl-2">{filterSectionTitle}</h4>
            )}

            {filterBy.map((item, idx) => (
              <li key={idx}>
                <Button onClick={() => handleOnClickItem(item, 3)}>
                  {item}
                </Button>
              </li>
            ))}
          </DropdownButton>
        </div>
      )}
    </>
  );
};

export default SortOrder;
