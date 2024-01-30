import Carousel from "@/components/Carousel/Carousel";
import HomeHero from "@/components/HomeHero/HomeHero";
import InfoCard from "@/components/InfoCard/InfoCard";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { DoctorSpecializations, ProductCategory } from "@/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home({
  prodCategory,
  specialist,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [prod, setProd] = useState<ProductCategory>(
    prodCategory as ProductCategory
  );
  const [spec, setSpec] = useState<DoctorSpecializations[]>(
    specialist as DoctorSpecializations[]
  );
  const prodCat = useCustomSWR<ProductCategory>(
    !prodCategory ? `${apiBaseUrl}/product-categories` : null
  );
  const special = useCustomSWR<DoctorSpecializations[]>(
    !specialist ? `${apiBaseUrl}/doctor-specialists` : null
  );

  useEffect(() => {
    if (!prodCategory && prodCat.data) {
      setProd(prodCat.data);
    }

    if (!specialist && special.data) {
      setSpec(special.data);
    }
  }, [prodCategory, special.data, prodCat.data, specialist]);

  const { push } = useRouter();

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <HomeHero />
      <div className="w-4/5 m-auto text-center mt-[6rem] text-[2rem] font-bold">
        <h3>Consult a Doctor</h3>
        <div className="grid grid-cols-5 gap-y-6 mt-[2rem] max-lg:grid-cols-3 gap-x-[1rem] max-sm:grid-cols-2">
          {spec &&
            spec.map((val, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center gap-[0.5rem] cursor-pointer"
                onClick={() => push("/consultations")}
              >
                <div className="relative flex justify-center items-center bg-[#36A5B2] h-28 w-28 rounded-full">
                  <Image src={val.image} alt={val.name} fill sizes="100%" />
                </div>
                <p className="text-lg">{val.name}</p>
              </div>
            ))}
        </div>
        {!spec && (
          <div className="flex flex-col justify-center items-center gap-[0.5rem] text-base">
            There are no doctor specialization.
          </div>
        )}
        <h3 className="mt-[3rem]">Product Categories</h3>
        <div className="grid grid-cols-5 gap-y-6 mt-[2rem] max-lg:grid-cols-3 gap-x-[1rem] max-sm:grid-cols-2">
          {prod &&
            prod.data.map((val, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center gap-[0.5rem]"
              >
                <div className="relative flex justify-center items-center bg-[#36A5B2] h-28 w-28 rounded-full">
                  <Image src={val.image} alt={val.name} fill sizes="100%" />
                </div>
                <p className="text-lg">{val.name}</p>
              </div>
            ))}
        </div>
        {!prod && (
          <div className="flex flex-col justify-center items-center gap-[0.5rem] text-base">
            There are no product category list.
          </div>
        )}
      </div>
      <Carousel
        content1="We Make Buying Medicines Simple and Easy For You"
        content2="Consult With a Doctor in Just a Matter of Seconds"
        content3="The Most Complete Health Solution"
      />
      <div className="relative w-4/5 m-auto grid grid-cols-4 py-28 gap-[2rem] max-lg:grid-cols-2">
        <div className="top-[-40px] m-auto flex items-center absolute justify-center w-full">
          <InfoCard variants="primary" text="More Than Just Medicines" />
        </div>
        <InfoCard variants="secondary" info={2000} text="Consults" />
        <InfoCard variants="secondary" info={3} text="Glorious Years" />
        <InfoCard variants="secondary" info={750} text="Active Clients" />
        <InfoCard variants="secondary" info={55} text="Professional Doctors" />
      </div>
    </>
  );
}

type ServerSideHome = {
  prodCategory: ProductCategory | undefined;
  specialist: DoctorSpecializations[] | undefined;
};

export const getServerSideProps: GetServerSideProps<
  ServerSideHome
> = async () => {
  try {
    const [res1, res2] = await Promise.all([
      fetch(`${apiBaseUrl}/product-categories`),
      fetch(`${apiBaseUrl}/doctor-specialists`),
    ]);

    if (!res1.ok || !res2.ok) {
      throw new Error(
        `Error code ${!res1.ok ? res1.status : res2.status} ${
          !res1.ok ? res1.statusText : res2.statusText
        }`
      );
    }
    const [productCategories, specialist] = await Promise.all([
      res1.json(),
      res2.json(),
    ]);

    return {
      props: {
        prodCategory: productCategories,
        specialist: specialist,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
