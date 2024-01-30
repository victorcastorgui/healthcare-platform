import { capitalizeFirstChar } from "@/utils/formatter/capitalizeFirstChar";

type TOrderStatus = {
  status: string;
};

const OrderStatus = ({ status }: TOrderStatus) => {
  const orderStatus = [
    "waiting for payment",
    "waiting for payment confirmation",
    "processed",
    "sent",
    "order confirmed",
    "canceled",
    "accept",
    "decline",
    "pending",
    "online",
    "offline",
    "busy",
    "ongoing",
  ];

  let variantStyle = "";
  switch (status.toLowerCase()) {
    case orderStatus[0]:
      variantStyle = "bg-orange-waiting";
      break;
    case orderStatus[1]:
      variantStyle = "bg-blue-confirmation";
      break;
    case orderStatus[2]:
      variantStyle = "bg-blue-processed";
      break;
    case orderStatus[3]:
      variantStyle = "bg-green-sent";
      break;
    case "ongoing":
      variantStyle = "bg-green-sent";
      break;
    case orderStatus[4]:
      variantStyle = "bg-gray-confirmed";
      break;
    case orderStatus[5]:
      variantStyle = "bg-red-canceled";
      break;
    case orderStatus[6]:
      variantStyle = "bg-green-sent";
      break;
    case orderStatus[7]:
      variantStyle = "bg-red-canceled";
      break;
    case orderStatus[8]:
      variantStyle = "bg-orange-waiting";
      break;
    case "ended":
      variantStyle = "bg-red-canceled";
      break;
    case orderStatus[9]:
      variantStyle = "bg-green-sent";
      break;
    case orderStatus[10]:
      variantStyle = "bg-red-canceled";
      break;
    case orderStatus[11]:
      variantStyle = "bg-orange-waiting";
      break;
    case orderStatus[12]:
      variantStyle = "bg-green-sent";
      break;
  }
  return (
    <div
      className={`px-3 ${variantStyle} w-fit rounded-full flex items-center justify-center`}
    >
      <p className="text-white font-medium text-sm text-center">
        {capitalizeFirstChar(status)}
      </p>
    </div>
  );
};

export default OrderStatus;
