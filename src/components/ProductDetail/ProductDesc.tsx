import React from "react";

interface IProductDescStyle {
  title: string;
  desc: string;
}

const ProductDesc = ({ title, desc }: IProductDescStyle) => {
  return (
    <>
      <h3 className="font-semibold text-black text-lg">{title}</h3>
      <div className="text-[#999999] mt-2">{desc}</div>
      <hr className="h-px mt-5 mb-6 bg-gray-200 border-0"></hr>
    </>
  );
};

export default ProductDesc;
