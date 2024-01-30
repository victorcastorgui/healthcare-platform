import BackButton from '@/components/Button/BackButton';
import Button from '@/components/Button/Button';
import AdminHeader from '@/components/Header/AdminHeader';
import { InputField } from '@/components/Input/InputField';
import RadioField from '@/components/Input/RadioField';
import AdminLayout from '@/components/Layout/AdminLayout';
import { apiBaseUrl } from '@/config';
import { useCustomSWR } from '@/hooks/useCustomSWR';
import { useFetch } from '@/hooks/useFetch';
import { CategoryData } from '@/types';
import { getToken } from '@/utils/token';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

function ProductCategoryEdit() {
  const [categoryName, setCategoryName] = useState('');
  const [isDrug, setIsDrug] = useState<boolean | null>(null);
  const [image, setImage] = useState<File | null | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>();
  const token = getToken();
  const { query } = useRouter();
  const { data, fetchData: postData, errorMsg, setErrorMsg } = useFetch();
  const { push } = useRouter();
  const [errorCMsg, setErrorCMsg] = useState('');
  const [errorDMsg, setErrorDMsg] = useState('');
  const [errorIMsg, setErrorIMsg] = useState('');

  let url = `${apiBaseUrl}/product-categories/${query.edit}`;
  const { data: categoryData } = useCustomSWR<CategoryData>(
    query.edit !== undefined ? url : null
  );

  useEffect(() => {
    if (categoryData !== undefined) {
      setCategoryName(categoryData.data.name as string);
      setIsDrug(categoryData.data.is_drug as boolean);
      setPreviewImage(categoryData.data.image as string);
    }
  }, [categoryData]);

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
      setErrorMsg('');
    }
    if (data === '') {
      return;
    }
    if (data) {
      toast.success('Product category has been edited succesfully!');
      push('/admin/super/product-category');
    }
  }, [data, errorMsg]);
  useEffect(() => {
    setErrorCMsg('');
    setDisabled(false);
  }, [categoryName]);

  useEffect(() => {
    setErrorDMsg('');
    setDisabled(false);
  }, [isDrug]);

  useEffect(() => {
    setErrorIMsg('');
    setDisabled(false);
  }, [image]);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleValidateSubmitCategory();
    }
  };
  const handleValidateSubmitCategory = () => {
    let error = false;
    const categoryNameRegex = /^[a-zA-Z& ]+$/;
    if (categoryName === '') {
      setErrorCMsg(
        'Category name must not contain special character or number except &!'
      );
      error = true;
    } else {
      const validateName = categoryNameRegex.test(categoryName);
      if (!validateName) {
        setErrorCMsg('Category name is not valid!');
        error = true;
      }
    }
    if (isDrug === null) {
      setErrorDMsg(
        'Please indicate whether this category is considered as drug or not!'
      );
      error = true;
    }
    if (image) {
      if (image.size > 500000) {
        setErrorIMsg('Image size should not exceed 500 kB');
        error = true;
      }
    }
    if (error) {
      setDisabled(true);
      return;
    }

    handleSubmitData();
  };

  const handleSubmitData = async () => {
    const formData = new FormData();
    formData.append('name', categoryName.trim());
    if (categoryData?.data.image !== previewImage) {
      formData.append('image', image as File);
    }
    if (isDrug !== null) {
      formData.append('is_drug', isDrug.toString());
    }

    const URL = `${apiBaseUrl}/product-categories/${query.edit}`;
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };
    await postData(URL, options);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Product List Edit</title>
      </Head>
      <AdminHeader>Edit Product Category</AdminHeader>
      <div className='mt-8 flex flex-col gap-4 max-lg:items-center'>
        <BackButton route='/admin/super/product-category' />
        <div className='w-96 max-sm:w-4/5'>
          <InputField
            type='text'
            name='categoryName'
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
            label='Category Name'
            err={errorCMsg}
            onKeyDown={handleOnKeyDown}
          />
        </div>
        <label>
          Is this category considered as drugs?
          <RadioField
            checked={isDrug === true ? true : false}
            onChange={() => setIsDrug(true)}
            readOnly
          >
            Yes
          </RadioField>
          <RadioField
            checked={isDrug === false ? true : false}
            onChange={() => setIsDrug(false)}
            readOnly
          >
            No
          </RadioField>
          <div className='label'>
            <span className='label-text-alt text-red-500'>{errorDMsg}</span>
          </div>
        </label>
        <div className='border-2 border-primary h-40 w-40 rounded-lg relative overflow-hidden'>
          {categoryData && categoryData.data.image && previewImage && (
            <Image
              src={previewImage as string}
              fill
              sizes='100%'
              alt='product category image'
              priority
            />
          )}
        </div>
        <label className='flex flex-col'>
          Category image {'(.png)'}:
          <input
            type='file'
            className='file-input file-input-bordered file-input-primary w-full max-w-xs'
            onChange={e => handleChangeImage(e)}
            accept='image/png'
            onKeyDown={handleOnKeyDown}
          />
          <div className='label'>
            <span className='label-text-alt text-red-500'>{errorIMsg}</span>
          </div>
        </label>
        <div className='flex w-full justify-end'>
          <div className='w-52 mb-8'>
            <Button
              variants='primary'
              disabled={disabled}
              onClick={handleValidateSubmitCategory}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ProductCategoryEdit;
