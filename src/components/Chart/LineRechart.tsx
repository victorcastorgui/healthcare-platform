import { PharmacyGraph, ProductCategoryGraph, ProductGraph } from "@/types";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BaseCard from "../Card/BaseCard";

type Chart = {
  data: PharmacyGraph[] | ProductCategoryGraph[] | ProductGraph[];
  title: string;
  variants: string;
  xAxisKey: string;
  yAxisKey: string;
};

function LineRechart({ data, title, variants, xAxisKey, yAxisKey }: Chart) {
  let variantStyle;
  switch (variants) {
    case "primary":
      variantStyle = "#82ca9d";
      break;
    case "secondary":
      variantStyle = "#8884d8";
      break;
    case "tertiary":
      variantStyle = "#ffc658";
      break;
    case "quarternary":
      variantStyle = "#rgb(208,97,18)";
      break;
  }
  return (
    <BaseCard customStyle="h-80 mt-4 w-full">
      <h2>{title}</h2>

      {data.length !== 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={yAxisKey} stroke={variantStyle} />
            <Line
              type="monotone"
              dataKey={"total_item"}
              stroke={variantStyle}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex w-full h-full justify-center items-center text-red-500 text-xl">
          Not Found
        </div>
      )}
    </BaseCard>
  );
}

export default LineRechart;
