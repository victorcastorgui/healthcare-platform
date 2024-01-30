import { apiBaseUrl, webSocketApiUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useFetch } from "@/hooks/useFetch";
import { Chat } from "@/types";
import { getToken } from "@/utils/token";
import { Laptop, SendHorizontal } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import Button from "../Button/Button";
import { InputField } from "../Input/InputField";
import ConfirmationModal from "../Modal/ConfirmationModal";

type TCurrentChat = {
  currentChat: number | undefined;
  dataMutate: boolean;
  setDataMutate: Dispatch<SetStateAction<boolean>>;
};

export type Event = {
  type: string;
  payload: any;
};

export type ChatData = {
  user_id: number;
  chat_time: string;
  message: string;
  message_type: number;
};

export type SendMessageEvent = {
  message: string;
  from: number;
};

export type NewMessageEvent = {
  message: string;
  from: number;
  sent: string;
};

function CurrentChatDoctor({
  currentChat,
  setDataMutate,
  dataMutate,
}: TCurrentChat) {
  const token = getToken();
  const [chat, setChat] = useState<ChatData[]>([]);
  const [message, setMessage] = useState("");
  const getChat = useCustomSWR<Chat>(
    currentChat ? `${apiBaseUrl}/telemedicines/${currentChat}` : null
  );
  const { data, fetchData: putData } = useFetch();
  const [openModal, setOpenModal] = useState(false);

  const { sendMessage } = useWebSocket(
    `${webSocketApiUrl}/chat/${currentChat}?token=${token}`,
    {
      onOpen: () => {
        console.log(`connected`);
      },
      onMessage: () => {
        getChat.mutate();
      },
    }
  );

  useEffect(() => {
    if (getChat.data !== undefined) {
      setChat(getChat.data?.data.chats);
    }
  }, [getChat]);

  useEffect(() => {
    getChat.mutate();
    setDataMutate(!dataMutate);
  }, [data]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (message.trim() !== "") {
      if (e.code == "Enter") {
        const m: Event = {
          payload: {
            from: getChat.data?.data.doctor.id,
            message: message,
          },
          type: "send_message",
        };
        setMessage("");
        sendMessage(JSON.stringify(m));
      }
    }
  };

  const handleEndChat = async () => {
    const URL = `${apiBaseUrl}/telemedicines/${currentChat}/end`;
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await putData(URL, options);
  };

  return (
    <>
      {getChat.data && getChat.data !== undefined ? (
        <div className="bg-[#F2F3F9] w-[60%] flex flex-col">
          <div className="bg-white px-4 py-4 mb-2 justify-between flex">
            <div className="flex gap-4">
              <div className="relative h-[3rem] w-[3rem] rounded-full overflow-hidden">
                <Image
                  src={getChat.data.data.profile.image}
                  fill
                  sizes="100%"
                  alt={getChat.data.data.profile.name}
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[1rem]">
                  {getChat.data.data.profile.name}
                </h3>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Button variants="danger" onClick={() => setOpenModal(true)}>
                End Chat
              </Button>
            </div>
          </div>
          <div className="h-full px-2 overflow-y-scroll flex flex-col-reverse relative">
            {chat !== undefined ? (
              <>
                {chat.map((message, index) => (
                  <div
                    key={index}
                    className={`chat ${
                      message.user_id === getChat.data?.data.doctor.id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div
                      className={`chat-bubble relative ${
                        message.user_id === getChat.data?.data.doctor.id
                          ? "bg-[#00383F]"
                          : "chat-bubble-primary"
                      } text-white`}
                    >
                      <p>{message.message}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full bg-white px-4 flex justify-center items-center gap-2">
            <InputField
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              onKeyDown={handleEnter}
              disabled={getChat.data.data.status === "ended"}
            />
            <SendHorizontal className="text-[#36A5B2] h-8 w-auto" />
          </div>
        </div>
      ) : (
        <div className="bg-[#F2F3F9] w-[60%] h-full flex flex-col justify-center items-center">
          <Laptop className="text-[#979797] h-28 w-[100%]" />
          <p className="text-[#979797] font-semibold">No Chat Found</p>
        </div>
      )}
      {openModal && (
        <ConfirmationModal
          isOpen={openModal}
          setIsOpen={setOpenModal}
          message="Are you sure you want to end chat?"
          orderId={currentChat as number}
          handleOnConfirm={handleEndChat}
          newStatus={0}
        />
      )}
    </>
  );
}

export default CurrentChatDoctor;
