import Image from "next/image";
import Left1 from "../../../public/images/1left.png";
import Right1 from "../../../public/images/1right.png";
import Left2 from "../../../public/images/2left.png";
import Right2 from "../../../public/images/2right.png";
import Left3 from "../../../public/images/3left.png";
import Right3 from "../../../public/images/3right.png";

function BackgroundCard() {
  return (
    <div className="absolute w-full max-sm:hidden">
      <Image
        className="absolute left-0 top-[-765px]"
        src={Left1}
        alt="hero background image"
      />
      <Image
        className="absolute left-0 top-[-651px]"
        src={Left2}
        alt="hero background image"
      />
      <Image
        className="absolute left-0 top-[-566px]"
        src={Left3}
        alt="hero background image"
      />
      <Image
        className="absolute right-0 top-[-657px]"
        src={Right1}
        alt="hero background image"
      />
      <Image
        className="absolute right-0 top-[-597px]"
        src={Right2}
        alt="hero background image"
      />
      <Image
        className="absolute right-0 top-[-561px]"
        src={Right3}
        alt="hero background image"
      />
    </div>
  );
}

export default BackgroundCard;
