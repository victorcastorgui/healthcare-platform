import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useDebounce } from "@/hooks/useDebounce";
import { Chats } from "@/types";
import { XCircle } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InputField } from "../Input/InputField";
import OrderStatus from "../Label/OrderStatus";

type TChatList = {
  setCurrentChat: Dispatch<SetStateAction<number | undefined>>;
  dataMutate: boolean;
};
function ChatListDoctor({ setCurrentChat, dataMutate }: TChatList) {
  const [search, setSearch] = useState("");
  const searchDebounce = useDebounce<string>(search);

  const chats = useCustomSWR<Chats>(
    `${apiBaseUrl}/telemedicines?name=${searchDebounce}`
  );

  useEffect(() => {
    chats.mutate();
  }, [dataMutate]);

  return (
    <div className="h-full scrollbar-custom overflow-y-scroll bg-white w-[40%] border-r-2 border-[#36A5B2] px-4">
      <div className="sticky top-0 bg-white border-b-2">
        <InputField
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
      </div>

      {chats.data && chats.data.data.length > 0 ? (
        chats.data.data.map((val, idx) => (
          <div
            key={idx}
            className="flex gap-2 border-b-2 border-[#36A5B2] py-2 cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-200"
            onClick={() => {
              setCurrentChat(val.id);
            }}
          >
            <div className="relative h-[3rem] w-[3rem] rounded-full overflow-hidden">
              <Image
                src={val.profile.image}
                fill
                sizes="100%"
                alt={val.doctor.name}
              />
            </div>
            <div>
              <h3 className="text-[1.25rem] font-semibold">
                {val.profile.name}
              </h3>
              <p className="text-[#939393] text-[0.8rem]">
                {val.chats.length !== 0 ? val.chats[0].message : ""}
              </p>
            </div>
            <div>
              <OrderStatus status={val.status} />
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col justify-center items-center h-[70%]">
          <XCircle className="text-[#979797] h-28 w-[100%]" />
          <p className="text-[#979797] font-semibold">No Chat Found</p>
        </div>
      )}
    </div>
  );
}

export default ChatListDoctor;
