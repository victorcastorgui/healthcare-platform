import { PharmacyGraph, ProductCategoryGraph, ProductGraph } from "@/types";
import {
  Area,
  AreaChart,
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
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{ top: 10, right: 50, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={yAxisKey}
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
            <Area
              type="monotone"
              dataKey={"total_item"}
              stroke="#FFC0CB"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
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
