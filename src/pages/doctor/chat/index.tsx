import BaseCard from "@/components/Card/BaseCard";
import ChatListDoctor from "@/components/Chat/ChatListDoctor";
import CurrentChatDoctor from "@/components/Chat/currentChatDoctor";
import Head from "next/head";
import { useState } from "react";

function DoctorChat() {
  const [currentChat, setCurrentChat] = useState<number | undefined>();
  const [dataMutate, setDataMutate] = useState<boolean>(false);
  return (
    <div>
      <Head>
        <title>Checkout</title>
      </Head>
      <div className="pt-40 pb-20 w-11/12 lg:w-4/5 m-auto h-screen max-w-screen-xl">
        <BaseCard customStyle="h-full !flex-row">
          <ChatListDoctor
            setCurrentChat={setCurrentChat}
            dataMutate={dataMutate}
          />
          <CurrentChatDoctor
            currentChat={currentChat}
            dataMutate={dataMutate}
            setDataMutate={setDataMutate}
          />
        </BaseCard>
      </div>
    </div>
  );
}

export default DoctorChat;
