import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "../../../features/messages/messagesApi";
import Error from "../../ui/Error";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";

export default function ChatBody() {
  const { id } = useParams();
  const { data: messages, isLoading, isError, error } = useGetMessagesQuery(id);
  // what to render
  let content = null;
  if (isLoading) {
    content = <div className="p-4">Loading...</div>;
  } else if (!isLoading && isError) {
    content = <Error message={error?.data} />;
  } else if (!isLoading && !isError && messages.length === 0) {
    content = <div className="p-4">No message Found</div>;
  } else if (!isLoading && !isError && messages.length > 0) {
    content = (
      <>
        <ChatHead message={messages[0]} />
        <Messages message={messages} />
        <Options />
      </>
    );
  }

  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">{content}</div>
    </div>
  );
}
