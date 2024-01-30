import Button from '@/components/Button/Button';
import AdminHeader from '@/components/Header/AdminHeader';
import AdminLayout from '@/components/Layout/AdminLayout';
import Pagination from '@/components/Pagination/Pagination';
import Table from '@/components/Table/Table';
import { useFetch } from '@/hooks/useFetch';
import { useFilter } from '@/hooks/useFilter';
import { adminTableNumbering } from '@/lib/adminTableNumbering';
import { isDrug } from '@/lib/filterBy';
import { ProductCategory } from '@/types';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'sonner';

function SuperProductCategory() {
  const tableHeads = ['', `Name`, 'Is Drugs', 'Image', ''];
  const { push } = useRouter();
  const { data, fetchData: deleteData } = useFetch();

  let url = `product-categories`;
  const {
    swrResponse: category,
    handleSearchInput,
    searchInput,
    setOrderTitle,
    orderTitle,
    setFilterTitle,
    filterTitle,
    setPage,
  } = useFilter<ProductCategory>(url, 'name', 'name', 5, 'is_drug', isDrug);

  useEffect(() => {
    if (data === '') {
      return;
    }
    if (data !== null) {
      toast.success('Product category has been deleted!');
      category.mutate();
    }
  }, [data]);

  return (
    <AdminLayout>
      <Head>
        <title>Product Categories</title>
      </Head>
      <AdminHeader>Product Categories</AdminHeader>
      <Table
        tableHeads={tableHeads}
        searchInput={searchInput}
        handleSearchInput={handleSearchInput}
        sortBy={['Name']}
        sortTitle='Name'
        orderTitle={orderTitle}
        setOrderTitle={setOrderTitle}
        setFilterTitle={setFilterTitle}
        filterTitle={filterTitle}
        filterBy={['Drugs', 'Non-Drugs']}
        searchName={'Search by Name...'}
        componentBesideSearch={
          <Button
            onClick={() => push('/admin/super/product-category/add')}
            variants='primary'
          >
            Add Category
          </Button>
        }
      >
        {category.data?.data.map((val, index) => (
          <tr key={adminTableNumbering(category.data!.current_page, index)}>
            <td>{adminTableNumbering(category.data!.current_page, index)}</td>
            <td>{val.name}</td>
            <td>{val.is_drug ? 'Yes' : 'No'}</td>
            <td>
              <div className='relative w-[50px] h-[50px]'>
                {val.image && (
                  <Image
                    src={val.image}
                    sizes='100%'
                    fill
                    alt='product category image'
                    priority
                  />
                )}
              </div>
            </td>
            <td className='flex gap-4'>
              <div className='w-full'>
                <Button
                  variants='secondary'
                  onClick={() =>
                    push(`/admin/super/product-category/edit/${val.id}`)
                  }
                >
                  Edit
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
      <div className='flex w-full justify-center my-8'>
        {category.data && (
          <Pagination
            totalPage={category.data.total_page}
            activePage={category.data.current_page}
            setPage={setPage}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default SuperProductCategory;
