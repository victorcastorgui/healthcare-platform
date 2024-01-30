import BackButton from '@/components/Button/BackButton';
import Button from '@/components/Button/Button';
import AdminHeader from '@/components/Header/AdminHeader';
import { InputField } from '@/components/Input/InputField';
import RadioField from '@/components/Input/RadioField';
import { SelectField } from '@/components/Input/SelectField';
import { TextArea } from '@/components/Input/TextArea';
import AdminLayout from '@/components/Layout/AdminLayout';
import { apiBaseUrl } from '@/config';
import useDrugClassification from '@/hooks/useDrugClassification';
import { useDrugForm } from '@/hooks/useDrugForm';
import { useFetch } from '@/hooks/useFetch';
import useProdCategory from '@/hooks/useProdCategory';
import { DrugData, ProductData } from '@/types';
import { getToken } from '@/utils/token';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Errors = {
  name: string;
  manufacture: string;
  detail: string;
  unit_in_pack: string;
  weight: string;
  height: string;
  length: string;
  width: string;
  image: string;
  product_category_id: string;
  generic_name: string;
  drug_form_id: string;
  drug_classification_id: string;
  content: string;
  selling_unit: string;
  price: string;
};

function AddProductData() {
  const [isDrug, setIsDrug] = useState(false);
  const [preview, setPreview] = useState<string | null>();

  const [formData, setFormData] = useState<ProductData>({
    name: '',
    manufacture: '',
    detail: '',
    unit_in_pack: '',
    weight: '',
    height: '',
    length: '',
    width: '',
    image: null,
    product_category_id: 0,
    is_hidden: false,
    selling_unit: '',
    price: '',
  });

  const [formDataDrug, setFormDataDrug] = useState<DrugData>({
    content: '',
    drug_classification_id: 0,
    drug_form_id: 0,
    generic_name: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    manufacture: '',
    detail: '',
    unit_in_pack: '',
    weight: '',
    height: '',
    length: '',
    width: '',
    image: '',
    product_category_id: '',
    content: '',
    drug_classification_id: '',
    drug_form_id: '',
    selling_unit: '',
    generic_name: '',
    price: '',
  });

  const { arrProdCategory, objProdCategory, objIsDrug } = useProdCategory();
  const { arrDrugForm, objDrugForm } = useDrugForm();
  const { arrDrugClassification, objDrugClassification } =
    useDrugClassification();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const inpKeyName = [
      'name',
      'manufacture',
      'detail',
      'unit_in_pack',
      'weight',
      'height',
      'length',
      'width',
      'product_category_id',
      'selling_unit',
      'price',
    ];

    setErrors(prevData => {
      setDisabled(false);
      return { ...prevData, [e.target.name]: '' };
    });

    const inpName = e.target.name;

    if (inpKeyName.includes(inpName)) {
      setFormData(prevData => {
        return { ...prevData, [e.target.name]: e.target.value };
      });
    }
    if (inpName === 'isHidden') {
      const hidden = e.target.value === 'yes' ? true : false;

      setFormData(prevData => {
        return { ...prevData, [e.target.name]: hidden };
      });
    }
    if (inpName === 'image') {
      const val = e.target as HTMLInputElement;
      if (val.files && val.files[0]) {
        setPreview(URL.createObjectURL(val.files[0]));
        setFormData(prevData => {
          return { ...prevData, [e.target.name]: val.files![0] };
        });
      }
    }
  };

  const handleChangeDrugs = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrors(prevData => {
      setDisabled(false);
      return { ...prevData, [e.target.name]: '' };
    });
    setFormDataDrug(prevData => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  };

  const [disabled, setDisabled] = useState(false);
  const token = getToken();
  const { data, fetchData: postData, errorMsg, setErrorMsg } = useFetch();
  const { push } = useRouter();

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
      setErrorMsg('');
    }
    if (data === '') {
      return;
    }
    if (data !== null) {
      toast.success('Product data has been added!');
      push('/admin/super/product-list');
    }
  }, [data, errorMsg]);

  useEffect(() => {
    for (const k in errors) {
      const key = k as keyof (ProductData | Errors);
      if (
        (formData[key] === '' || formData[key] !== '') &&
        errors[key] === ''
      ) {
        setDisabled(false);
      } else {
        setDisabled(true);
        return;
      }
    }
  }, [errors, formData]);

  useEffect(() => {
    setIsDrug(objIsDrug[formData.product_category_id]);
  }, [formData.product_category_id, objIsDrug]);

  const handleValidateSubmitData = () => {
    let error = false;
    for (const key in formData) {
      const keyType = key as keyof ProductData;
      if (
        formData[keyType] === '' ||
        formData[keyType] === null ||
        formData[keyType] === undefined ||
        formData[keyType] === 0
      ) {
        error = true;
        setErrors(prevData => {
          return { ...prevData, [key]: 'This field is required' };
        });
      }
    }

    if (isDrug) {
      for (const key in formDataDrug) {
        const keyType = key as keyof DrugData;
        if (
          formDataDrug[keyType] === '' ||
          formDataDrug[keyType] === null ||
          formDataDrug[keyType] === undefined ||
          formDataDrug[keyType] === 0
        ) {
          error = true;
          setErrors(prevData => {
            return { ...prevData, [key]: 'This field is required' };
          });
        }
      }
    }

    if (parseInt(formData.weight) < 0) {
      error = true;
      setErrors(prevData => {
        return { ...prevData, weight: 'Weight must be greater than 0 gram!' };
      });
    }
    if (parseInt(formData.height) < 0) {
      error = true;
      setErrors(prevData => {
        return { ...prevData, height: 'Height must be greater than 0 cm!' };
      });
    }
    if (parseInt(formData.length) < 0) {
      error = true;
      setErrors(prevData => {
        return { ...prevData, length: 'Weight must be greater than 0 cm!' };
      });
    }
    if (parseInt(formData.width) < 0) {
      error = true;
      setErrors(prevData => {
        return { ...prevData, width: 'Weight must be greater than 0 cm!' };
      });
    }
    if (
      parseInt(formData.price) < 500 ||
      parseInt(formData.price) > 100000000
    ) {
      error = true;
      setErrors(prevData => {
        return {
          ...prevData,
          price: 'Price must be greater than 500 and less than 100 million',
        };
      });
    }
    if (formData.image && formData.image!.size > 500000) {
      error = true;
      setErrors(prevData => {
        return { ...prevData, image: 'Image size should not exceed 500 kB' };
      });
    }

    if (error) {
      return;
    }

    handleSubmitData();
  };

  const handleSubmitData = async () => {
    const productData = new FormData();

    for (const key in formData) {
      const keyType = key as keyof ProductData;
      if (keyType !== 'image') {
        productData.append(`${keyType}`, formData[keyType]!.toString());
      } else {
        productData.append(`image`, formData['image'] as Blob);
      }
    }
    if (isDrug) {
      for (const key in formDataDrug) {
        const keyType = key as keyof DrugData;
        productData.append(`${keyType}`, formDataDrug[keyType]!.toString());
      }
    }

    const URL = `${apiBaseUrl}/products`;
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: productData,
    };
    await postData(URL, options);
    return;
  };
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleValidateSubmitData();
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Product List Add</title>
      </Head>
      <AdminHeader>Add Product Data</AdminHeader>
      <div className='mt-8 flex flex-col gap-4 max-lg:items-center'>
        <BackButton route='/admin/super/product-list' />
        <div className='grid grid-cols-4 gap-4'>
          <div className='flex col-span-4 gap-4 max-sm:flex-col'>
            <InputField
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              label='Product Name'
              err={errors.name}
              onKeyDown={handleOnKeyDown}
            />
            <InputField
              type='text'
              name='manufacture'
              value={formData.manufacture}
              onChange={handleChange}
              label='Manufacturer'
              err={errors.manufacture}
              onKeyDown={handleOnKeyDown}
            />
            <InputField
              type='text'
              name='selling_unit'
              value={formData.selling_unit}
              onChange={handleChange}
              label='Selling Unit'
              err={errors.selling_unit}
              onKeyDown={handleOnKeyDown}
            />
          </div>
          <div className='col-span-4'>
            <TextArea
              name='detail'
              value={formData.detail}
              onChange={handleChange}
              label='Detail'
              err={errors.detail}
            />
          </div>
          <div className='flex col-span-4 gap-4 max-sm:flex-col'>
            <SelectField
              name='product_category_id'
              onChange={handleChange}
              selectValue={objProdCategory}
              selectOption={arrProdCategory}
              label='Category'
              err={errors.product_category_id}
            />
            <InputField
              type='text'
              name='unit_in_pack'
              value={formData.unit_in_pack}
              onChange={handleChange}
              label='Unit In Pack'
              err={errors.unit_in_pack}
              onKeyDown={handleOnKeyDown}
            />
            <InputField
              type='number'
              min={0}
              name='price'
              value={formData.price}
              onChange={handleChange}
              label='Price (Rp)'
              err={errors.price}
              onKeyDown={evt =>
                ['e', 'E', '+', '-', '.'].includes(evt.key) &&
                evt.preventDefault()
              }
            />
          </div>
          <InputField
            type='number'
            min={0}
            name='weight'
            value={formData.weight}
            onChange={handleChange}
            label='Weight (gram)'
            err={errors.weight}
            onKeyDown={handleOnKeyDown}
          />
          <InputField
            type='number'
            min={0}
            name='height'
            value={formData.height}
            onChange={handleChange}
            label='Height (cm)'
            err={errors.height}
            onKeyDown={handleOnKeyDown}
          />
          <InputField
            type='number'
            min={0}
            name='width'
            value={formData.width}
            onChange={handleChange}
            label='Length (cm)'
            err={errors.width}
            onKeyDown={handleOnKeyDown}
          />
          <InputField
            type='number'
            min={0}
            name='length'
            value={formData.length}
            onChange={handleChange}
            label='Length (cm)'
            err={errors.length}
            onKeyDown={handleOnKeyDown}
          />
          <div className='flex max-sm:flex-col col-span-4'>
            <div>
              <div className='border-2 border-primary relative h-40 w-40 rounded-lg overflow-hidden'>
                {preview && (
                  <Image
                    className='object-fit'
                    src={preview as string}
                    fill
                    sizes='100%'
                    alt='product category image'
                  />
                )}
              </div>
              <label className='flex flex-col mt-4'>
                Category image {'(.png)'}:
                <input
                  name='image'
                  type='file'
                  className='file-input file-input-bordered file-input-primary w-full max-w-xs'
                  onChange={handleChange}
                  accept='image/png'
                  onKeyDown={handleOnKeyDown}
                />
                <div className='label'>
                  <span className='label-text-alt text-red-500'>
                    {errors.image}
                  </span>
                </div>
              </label>
            </div>
            <label>
              Do you want to hide this product?
              <RadioField onChange={handleChange} name='isHidden' value={'yes'}>
                Yes
              </RadioField>
              <RadioField
                onChange={handleChange}
                name='isHidden'
                value={'no'}
                defaultChecked
              >
                No
              </RadioField>
            </label>
          </div>
          {isDrug && (
            <div className='col-span-4 grid grid-cols-2 max-sm:grid-cols-1 gap-4'>
              <SelectField
                onChange={handleChangeDrugs}
                selectValue={objDrugClassification}
                selectOption={arrDrugClassification}
                label='Drug Classification'
                err={errors.drug_classification_id}
                name='drug_classification_id'
              />
              <SelectField
                onChange={handleChangeDrugs}
                selectValue={objDrugForm}
                selectOption={arrDrugForm}
                label='Drug Form'
                name='drug_form_id'
                err={errors.drug_form_id}
              />
              <InputField
                type='text'
                name='generic_name'
                value={formDataDrug.generic_name}
                onChange={handleChangeDrugs}
                label='Generic Name'
                err={errors.generic_name}
                onKeyDown={handleOnKeyDown}
              />
              <InputField
                type='text'
                name='content'
                value={formDataDrug.content}
                onChange={handleChangeDrugs}
                label='Content'
                err={errors.content}
                onKeyDown={handleOnKeyDown}
              />
            </div>
          )}
        </div>
        <div className='flex w-full justify-end'>
          <div className='w-52 mb-8'>
            <Button
              variants='primary'
              disabled={disabled}
              onClick={handleValidateSubmitData}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddProductData;
