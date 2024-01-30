import Button from "@/components/Button/Button";
import AdminHeader from "@/components/Header/AdminHeader";
import AdminLayout from "@/components/Layout/AdminLayout";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { useFilter } from "@/hooks/useFilter";
import useProdCategory from "@/hooks/useProdCategory";
import { adminTableNumbering } from "@/lib/adminTableNumbering";
import { ProductList } from "@/types";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

function ProductDataList() {
  const { arrProdCategory, objProdCategory } = useProdCategory();
  const tableHeads = ["", "Product Name", "Price", "Selling Unit", "Image", ""];
  const sortBy = ["Name", "Price"];
  const defaultSortTitle = sortBy[0];
  const filterParam = "category";
  const searchBy = "name";
  const {
    swrResponse: productList,
    handleSearchInput,
    searchInput,
    orderTitle,
    setOrderTitle,
    setFilterTitle,
    filterTitle,
    setPage,
    setSortTitle,
    sortTitle,
  } = useFilter<ProductList>(
    "products/admin",
    searchBy,
    defaultSortTitle,
    5,
    filterParam,
    objProdCategory
  );
  const { push } = useRouter();

  return (
    <AdminLayout>
      <Head>
        <title>Product List</title>
      </Head>
      <AdminHeader>Product List</AdminHeader>
      <Table
        tableHeads={tableHeads}
        searchInput={searchInput}
        handleSearchInput={handleSearchInput}
        sortBy={sortBy}
        sortTitle={sortTitle}
        setSortTitle={setSortTitle}
        orderTitle={orderTitle}
        setOrderTitle={setOrderTitle}
        setFilterTitle={setFilterTitle}
        filterTitle={filterTitle}
        filterBy={arrProdCategory}
        searchName={"Search by Name..."}
        componentBesideSearch={
          <Button
            onClick={() => push("/admin/super/product-list/add")}
            variants="primary"
          >
            Add Product
          </Button>
        }
      >
        {productList.data?.data.map((val, index) => (
          <tr key={adminTableNumbering(productList.data!.current_page, index)}>
            <td>
              {adminTableNumbering(productList.data!.current_page, index)}
            </td>
            <td>{val.name}</td>
            <td>{formatToRupiah(parseInt(val.price))}</td>
            <td>{val.selling_unit}</td>
            <td>
              <div className="relative w-[50px] h-[50px]">
                <Image
                  src={val.image}
                  sizes="100%"
                  fill
                  alt="product category image"
                  priority
                />
              </div>
            </td>
            <td className="flex gap-4">
              <div className="w-full">
                <Button
                  variants="secondary"
                  onClick={() =>
                    push(`/admin/super/product-list/edit/${val.id}`)
                  }
                >
                  Edit
                </Button>
              </div>
              <div className="w-full">
                <Button
                  variants="primary"
                  onClick={() => push(`/admin/super/product-list/${val.id}`)}
                >
                  Detail
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
      <div className="flex w-full justify-center my-8">
        {productList.data && (
          <Pagination
            totalPage={productList.data.total_page}
            activePage={productList.data.current_page}
            setPage={setPage}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default ProductDataList;
