import { useRouter } from "next/router";

interface ILogo {
  variant: string;
}

function Logo({ variant }: ILogo) {
  const { push } = useRouter();
  let variantStyle;
  switch (variant) {
    case "primary":
      variantStyle = "text-[#36A5B2]";
      break;
    case "secondary":
      variantStyle = "text-[#FEF5E7]";
      break;
    case "tertiary":
      variantStyle = "text-[#F2F3F9]";
      break;
  }
  return (
    <h1
      className={`text-3xl ${variantStyle} cursor-pointer`}
      onClick={() => push("/")}
    >
      EVER
      <span className="underline font-extrabold">HEALTH</span>
    </h1>
  );
}

export default Logo;
