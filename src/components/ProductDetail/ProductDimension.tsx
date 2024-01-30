import React from "react";

interface IProductDimension {
  length: string;
  width: string;
  height: string;
  weight: string;
}

const ProductDimension = ({
  length,
  width,
  height,
  weight,
}: IProductDimension) => {
  return (
    <>
      <h3 className="font-semibold text-black text-lg">Dimension</h3>
      <div className="grid grid-cols-2 justify-between gap-3 mt-2">
        <div className="text-sm text-black">
          Length: <span className="text-[#999999]">{length} cm</span>
        </div>
        <div className="text-sm text-black">
          Width: <span className="text-[#999999]">{width} cm</span>
        </div>
        <div className="text-sm text-black">
          Height: <span className="text-[#999999]">{height} cm</span>
        </div>
        <div className="text-sm text-black">
          Weight: <span className="text-[#999999]">{weight} gr</span>
        </div>
      </div>

      <hr className="h-px mt-5 mb-6 bg-gray-200 border-0"></hr>
    </>
  );
};

export default ProductDimension;
