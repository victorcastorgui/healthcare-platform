import AdminHeader from "@/components/Header/AdminHeader";
import AdminLayout from "@/components/Layout/AdminLayout";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { useFilter } from "@/hooks/useFilter";
import { useProvince } from "@/hooks/useProvince";
import { adminTableNumbering } from "@/lib/adminTableNumbering";
import { Pharmacies } from "@/types";
import { formatToTitleCase } from "@/utils/formatter/formatToTitleCase";
import moment from "moment";
import Head from "next/head";

const PharmacyList = () => {
  const tableHeads = [
    "",
    "Pharmacy Name",
    "Admin in Charge",
    "Operational Days",
    "Operational Hours",
    "City",
    "Province",
  ];
  const searchParam = "name";
  const defaultSortTitle = "Pharmacy Name";
  const tLimit = 5;
  const filterParam = "province";
  const sortBy = ["Pharmacy Name", "Admin Name"];

  const { arrProvinces, objProvinces } = useProvince();

  const {
    swrResponse: pharmacies,
    searchInput,
    handleSearchInput,
    sortTitle,
    setSortTitle,
    orderTitle,
    setOrderTitle,
    filterTitle,
    setFilterTitle,
    setPage,
  } = useFilter<Pharmacies>(
    "pharmacies/super-admin",
    searchParam,
    defaultSortTitle,
    tLimit,
    filterParam,
    objProvinces
  );

  return (
    <AdminLayout>
      <Head>
        <title>Pharmacy List | Super Admin</title>
      </Head>
      <AdminHeader>Pharmacy List</AdminHeader>
      <Table
        tableHeads={tableHeads}
        searchInput={searchInput}
        searchName="Seach by pharmacy name"
        handleSearchInput={handleSearchInput}
        sortBy={sortBy}
        sortTitle={sortTitle}
        setSortTitle={setSortTitle}
        orderTitle={orderTitle}
        setOrderTitle={setOrderTitle}
        filterTitle={filterTitle}
        setFilterTitle={setFilterTitle}
        filterBy={arrProvinces}
        filterSectionTitle="Provinces"
      >
        {pharmacies.data &&
          pharmacies.data.data.map((pharmacy, idx) => (
            <tr key={pharmacy.id}>
              <td className="w-16">
                {adminTableNumbering(pharmacies.data!.current_page, idx)}
              </td>
              <td className="w-48">{pharmacy.name}</td>
              <td>{formatToTitleCase(pharmacy.admin.name)}</td>
              <td className="w-48">
                {pharmacy.operational_day.map(
                  (day, idx) =>
                    `${day}${
                      idx < pharmacy.operational_day.length - 1 ? ", " : ""
                    }`
                )}
              </td>
              <td>{`${moment(pharmacy.start_time, [
                moment.ISO_8601,
                "hh:mm A",
              ]).format("hh:mm A")} - ${moment(pharmacy.end_time, [
                moment.ISO_8601,
                "hh:mm A",
              ]).format("hh:mm A")}`}</td>
              <td className="w-52">{formatToTitleCase(pharmacy.city)}</td>
              <td>{formatToTitleCase(pharmacy.province)}</td>
            </tr>
          ))}
      </Table>
      {pharmacies.data && (
        <div className="flex w-full justify-center my-8">
          <Pagination
            totalPage={pharmacies.data.total_page}
            activePage={pharmacies.data.current_page}
            setPage={setPage}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default PharmacyList;
