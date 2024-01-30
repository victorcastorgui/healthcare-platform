import CountUp from "react-countup";

type TInfoCard = {
  variants: string;
  info?: number;
  text: string;
};

function InfoCard({ variants, info, text }: TInfoCard) {
  let variantStyle;
  switch (variants) {
    case "primary":
      variantStyle = "bg-[#007986] w-[25rem] h-[5rem]";
      break;
    case "secondary":
      variantStyle = "bg-[#36A5B2] w-[15] h-[9rem]";
      break;
  }
  return (
    <div
      className={`flex flex-col text-center justify-center items-center rounded-[1.5rem] text-[#F2F3F9] ${variantStyle}`}
    >
      {info && (
        <p className="text-4xl">
          <CountUp end={info} enableScrollSpy />+
        </p>
      )}
      <p className="text-xl">{text}</p>
    </div>
  );
}

export default InfoCard;
