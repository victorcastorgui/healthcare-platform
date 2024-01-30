import BackButton from '@/components/Button/BackButton';
import Button from '@/components/Button/Button';
import AdminHeader from '@/components/Header/AdminHeader';
import { InputField } from '@/components/Input/InputField';
import RadioField from '@/components/Input/RadioField';
import AdminLayout from '@/components/Layout/AdminLayout';
import { apiBaseUrl } from '@/config';
import { useFetch } from '@/hooks/useFetch';
import { getToken } from '@/utils/token';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

function AddProductCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [isDrug, setIsDrug] = useState<boolean | null>(null);
  const [image, setImage] = useState<File | null | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>();
  const token = getToken();

  const { data, fetchData: postData, errorMsg, setErrorMsg } = useFetch();

  const { push } = useRouter();
  const [errorCMsg, setErrorCMsg] = useState('');
  const [errorDMsg, setErrorDMsg] = useState('');
  const [errorIMsg, setErrorIMsg] = useState('');

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
      setErrorMsg('');
    }
    if (data === '') {
      return;
    }
    if (data !== null) {
      toast.success('Product category has been added!');
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

  const handleValidateSubmitCategory = () => {
    let error = false;
    const categoryNameRegex = /^[a-zA-Z& ]+$/;
    if (categoryName === '') {
      setErrorCMsg('Category name required!');
      error = true;
    } else {
      const validateName = categoryNameRegex.test(categoryName);
      if (!validateName) {
        setErrorCMsg(
          'Category name must not contain special character or number except &!'
        );
        error = true;
      }
    }
    if (isDrug === null) {
      setErrorDMsg(
        'Please indicate whether this category is considered as drug or not!'
      );
      error = true;
    }
    if (!image) {
      setErrorIMsg('Category image required!');
      error = true;
    } else if (image.size > 500000) {
      setErrorIMsg('Image size should not exceed 500 kB');
      error = true;
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
    formData.append('image', image as File);
    if (isDrug !== null) {
      formData.append('is_drug', isDrug.toString());
    }

    const URL = `${apiBaseUrl}/product-categories`;
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };
    await postData(URL, options);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleValidateSubmitCategory();
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Product Categories Add</title>
      </Head>
      <AdminHeader>Add Product Category</AdminHeader>
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
          <RadioField onChange={() => setIsDrug(true)}>Yes</RadioField>
          <RadioField onChange={() => setIsDrug(false)}>No</RadioField>
          <div className='label'>
            <span className='label-text-alt text-red-500'>{errorDMsg}</span>
          </div>
        </label>
        <div className='border-2 border-primary relative h-40 w-40 rounded-lg overflow-hidden'>
          {previewImage && (
            <Image
              className='object-fit'
              src={previewImage as string}
              fill
              sizes='100%'
              alt='product category image'
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

export default AddProductCategory;
