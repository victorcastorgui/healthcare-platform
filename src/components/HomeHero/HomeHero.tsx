import { useRouter } from "next/router";
import BackgroundCard from "../BackgroundCard/BackgroundCard";
import Button from "../Button/Button";

function HomeHero() {
  const { push } = useRouter();
  return (
    <div className="max-[410px]:h-fit max-[410px]:pb-8 h-[60rem] pt-[200px] relative overflow-hidden max-sm:bg-[rgb(201,222,227)]">
      <div className="flex flex-col items-center justify-center text-center w-4/5 max-w-screen-xl mx-auto">
        <h3 className="text-[1.25rem] text-[#36A5B2]">
          Professional Health Care Service
        </h3>
        <h2 className="max-lg:text-[3.5rem] max-md:text-[3rem] max-sm:text-[2.5rem] text-[4rem] mt-[1.5rem]">
          We Are a Health Care Company located in Indonesia ready to make your
          life easier!!!
        </h2>
        <h4 className="text-[1rem] mt-[3rem]">
          At EVERHEALTH, we believe in providing healthcare to our customers.
          Our professional doctors and products are ready to meet your needs. No
          hassle needed just to be healthy. Need medicines? vitamins? consult
          doctors? Not a problem!
        </h4>
        <div className="flex gap-[3rem] mt-[2rem]">
          <div>
            <Button variants="primary" onClick={() => push("/consultations")}>
              Consult a doctor
            </Button>
          </div>
          <div>
            <Button variants="secondary" onClick={() => push("/products")}>
              Our Products
            </Button>
          </div>
        </div>
      </div>
      <BackgroundCard />
    </div>
  );
}

export default HomeHero;
