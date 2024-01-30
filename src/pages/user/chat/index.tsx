import BaseCard from "@/components/Card/BaseCard";
import ChatListUser from "@/components/Chat/ChatListUser";
import CurrentChatUser from "@/components/Chat/currentChatUser";
import Head from "next/head";
import { useState } from "react";
import { Chat } from "@/types";

function UserChat() {
  const [currentChat, setCurrentChat] = useState<number | undefined>();
  const [dataMutate, setDataMutate] = useState<boolean>(false);
  return (
    <div>
      <Head>
        <title>Checkout</title>
      </Head>
      <div className="pt-40 pb-20 w-11/12 lg:w-4/5 m-auto h-screen max-w-screen-xl">
        <BaseCard customStyle="h-full !flex-row">
          <ChatListUser
            setCurrentChat={setCurrentChat}
            dataMutate={dataMutate}
          />
          <CurrentChatUser
            currentChat={currentChat}
            dataMutate={dataMutate}
            setDataMutate={setDataMutate}
          />
        </BaseCard>
      </div>
    </div>
  );
}

export default UserChat;
