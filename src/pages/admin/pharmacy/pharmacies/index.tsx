import Button from "@/components/Button/Button";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { useFilter } from "@/hooks/useFilter";
import { adminTableNumbering } from "@/lib/adminTableNumbering";
import { ResponseError, TPharmacies, TPharmaciesData } from "@/types";
import { BookUser, Pencil } from "lucide-react";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";

const Pharmacies = () => {
  const tableHeads = [
    "",
    "Name",
    "Province",
    "City",
    "Operation Time",
    "Phone Number",
    "",
  ];
  const searchParam = "name";
  const defaultSortTitle = "Name";
  const limit = 6;
  const sortBy = ["Name", "Start Time", "End Time"];
  const router = useRouter();

  const {
    swrResponse: pharmacies,
    searchInput,
    handleSearchInput,
    sortTitle,
    setSortTitle,
    orderTitle,
    setOrderTitle,
    setPage,
  } = useFilter<TPharmacies<TPharmaciesData[]> & ResponseError>(
    `pharmacies`,
    searchParam,
    defaultSortTitle,
    limit
  );
  return (
    <PharmacyLayout>
      <Head>
        <title>Manage Pharmacies | Pharmacy</title>
      </Head>
      <h2 className="text-3xl font-bold max-lg:text-center">
        Manage Pharmacies
      </h2>

      <Table
        tableHeads={tableHeads}
        searchInput={searchInput}
        searchName="Seach by name"
        handleSearchInput={handleSearchInput}
        sortBy={sortBy}
        sortTitle={sortTitle}
        setSortTitle={setSortTitle}
        orderTitle={orderTitle}
        setOrderTitle={setOrderTitle}
        componentBesideSearch={
          <Button
            onClick={() => {
              router.push("/admin/pharmacy/pharmacies/add");
            }}
            variants="primary"
          >
            Add New Pharmacy
          </Button>
        }
      >
        {pharmacies.error && (
          <div>Error when fetching the data, please refresh the page</div>
        )}
        {pharmacies.data &&
          pharmacies.data.data.map((val, i) => (
            <tr key={`pharmacies-${i}`}>
              <td>{adminTableNumbering(pharmacies.data!.current_page, i)}</td>
              <td>{val.name}</td>
              <td>{val.province.name}</td>
              <td>{val.city.name}</td>
              <td>
                {moment(val.start_time, [moment.ISO_8601, "hh:mm A"]).format(
                  "hh:mm A"
                )}{" "}
                -
                {moment(val.end_time, [moment.ISO_8601, "hh:mm A"]).format(
                  "hh:mm A"
                )}
              </td>
              <td>{val.pharmacist_phone_number}</td>
              <td className="flex gap-4">
                <div className="tooltip" data-tip="Detail pharmacies">
                  <BookUser
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(`/admin/pharmacy/pharmacies/${val.id}`);
                    }}
                  />
                </div>
                <div className="tooltip" data-tip="Edit pharmacies">
                  <Pencil
                    color="#5a5a5a"
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(`/admin/pharmacy/pharmacies/edit/${val.id}`);
                    }}
                  />
                </div>
              </td>
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
    </PharmacyLayout>
  );
};

export default Pharmacies;
