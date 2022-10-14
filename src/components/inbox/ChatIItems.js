import ChatItem from "./ChatItem";
import { useConversationsQuery } from "../../features/conversations/conversationsApi";
import { useDispatch, useSelector } from "react-redux";
import Error from "../ui/Error";
import { useEffect } from "react";
import { userLoggedOut } from "../../features/auth/authSlice";
import moment from "moment";
import gravatarUrl from "gravatar-url";
import getPartnerInfo from "../../utils/getPartnerInfo";
import { Link } from "react-router-dom";

export default function ChatItems() {
  const dispatch = useDispatch();
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const { email: loggedInUserEmail } = loggedInUser || {};
  const {
    data: conversations,
    isError,
    isLoading,
    error,
  } = useConversationsQuery(loggedInUserEmail);
  // if jwt expired then go login page
  useEffect(() => {
    if (error?.data === "jwt expired") {
      dispatch(userLoggedOut());
      localStorage.removeItem("auth");
    }
  }, [error, dispatch]);

  // what to render
  let content = null;
  if (isLoading) {
    content = <div className="text-center p-4">Loading...</div>;
  } else if (!isLoading && isError) {
    content = <Error className="p-4 text-center" message={error?.data} />;
  } else if (!isLoading && !isError && conversations.length === 0) {
    content = <div className="text-center p-4">No Conversations Found</div>;
  } else if (!isLoading && !isError && conversations.length > 0) {
    content = conversations.map((conversation) => {
      const { id, message, participants, timestamp, users } = conversation;
      const partnerInfo = getPartnerInfo(users, loggedInUserEmail);
      return (
        <li key={id}>
          <Link to={`/inbox/${id}`}>
            <ChatItem
              avatar={gravatarUrl(partnerInfo.email, { size: 80 })}
              name={partnerInfo.name.toUpperCase()}
              lastMessage={message}
              lastTime={moment(timestamp).fromNow()}
            />
          </Link>
        </li>
      );
    });
  }

  return <ul>{content}</ul>;
}
