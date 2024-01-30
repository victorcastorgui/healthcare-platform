import Button from "@/components/Button/Button";
import AdminHeader from "@/components/Header/AdminHeader";
import Table from "@/components/Table/Table";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import { useFilter } from "@/hooks/useFilter";
import { arrRole, objRole } from "@/lib/filterBy";
import Spinner from "@/components/Loading/Spinner";
import { AllUsers, PostResponse } from "@/types";
import { adminTableNumbering } from "@/lib/adminTableNumbering";
import { formatToTitleCase } from "@/utils/formatter/formatToTitleCase";
import DeleteModal from "@/components/Modal/DeleteModal";
import { apiBaseUrl } from "@/config";
import { getToken } from "@/utils/token";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import AdminLayout from "@/components/Layout/AdminLayout";

const ManageUser = () => {
  const router = useRouter();
  const token = getToken();
  const tableHeads = ["", "Email", "Name", "Role", ""];
  const sortBy = ["Email"];
  const searchParam = "email";
  const defaultSortTitle = "Email";
  const vLimit = 5;
  const chosenFilterParam = "role_id";
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [userIdDelete, setUserIdDelete] = useState<number>(0);
  const [userEmailDelete, setUserEmailDelete] = useState<string>("");
  const { data, fetchData: deleteUser, error, errorMsg, setData } = useFetch();

  const {
    swrResponse: users,
    searchInput,
    orderTitle,
    setOrderTitle,
    setPage,
    filterTitle,
    setFilterTitle,
    handleSearchInput,
  } = useFilter<AllUsers>(
    "users",
    searchParam,
    defaultSortTitle,
    vLimit,
    chosenFilterParam,
    objRole
  );

  const handleDeleteUser = async (id: number) => {
    const url = `${apiBaseUrl}/admins-pharmacy/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await deleteUser(url, options);
  };

  useEffect(() => {
    const res = data as PostResponse;
    if (res.message === "delete success") {
      toast.success("Delete success!");
      setData("");
      return;
    }
    if (error !== null) {
      toast.error(`Delete failed, ${errorMsg}`);
    }
  }, [data, error, errorMsg, setData]);

  useEffect(() => {
    users.mutate();
  }, [users]);

  return (
    <AdminLayout>
      <DeleteModal
        isOpen={isOpenModal}
        setIsModalOpen={setIsOpenModal}
        handleDelete={handleDeleteUser}
        id={userIdDelete}
        name={`admin pharmacy with email "${userEmailDelete}"`}
      />
      <Head>
        <title>Manage User | Super Admin</title>
      </Head>
      <AdminHeader>Manage User</AdminHeader>
      {users.isLoading && <Spinner />}
      {users.error && (
        <div>Error when fetching data, please refresh the page</div>
      )}

      <Table
        tableHeads={tableHeads}
        searchInput={searchInput}
        searchName="Seach by email"
        handleSearchInput={handleSearchInput}
        sortBy={sortBy}
        sortTitle={defaultSortTitle}
        orderTitle={orderTitle}
        setOrderTitle={setOrderTitle}
        setFilterTitle={setFilterTitle}
        filterTitle={filterTitle}
        filterBy={arrRole}
        filterSectionTitle="Role"
        componentBesideSearch={
          <Button
            onClick={() => router.push("/admin/super/manage-user/add")}
            variants="primary"
          >
            Add Pharmacy Admin
          </Button>
        }
      >
        {users.data &&
          users.data.data.map((user, idx) => (
            <tr key={user.id}>
              <td className="w-20">
                {adminTableNumbering(users.data!.current_page, idx)}
              </td>
              <td>{user.email}</td>
              <td>{formatToTitleCase(user.name)}</td>
              <td>{formatToTitleCase(user.role.name)}</td>
              <td className="flex gap-4">
                {user.role.id === 3 ? (
                  <>
                    <div className="w-full">
                      <Button
                        variants="secondary"
                        onClick={() =>
                          router.push(
                            `/admin/super/manage-user/${user.id}/edit`
                          )
                        }
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="w-full">
                      <Button
                        variants="danger"
                        onClick={() => {
                          setIsOpenModal(true);
                          setUserIdDelete(user.id);
                          setUserEmailDelete(user.email);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button className="btn btn-ghost opacity-0 cursor-default">
                    Empty
                  </Button>
                )}
              </td>
            </tr>
          ))}
      </Table>
      {users.data && (
        <div className="flex w-full justify-center my-8">
          <Pagination
            totalPage={users.data.total_page}
            activePage={users.data.current_page}
            setPage={setPage}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageUser;
