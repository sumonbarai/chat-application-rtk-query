import { useSelector } from "react-redux";
import Message from "./Message";

export default function Messages({ message }) {
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const { email: loggedInUserEmail } = loggedInUser || {};
  return (
    <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
      <ul className="space-y-2">
        {message
          .slice()
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((mess) => {
            const { id, message, sender } = mess;
            const justify =
              sender.email !== loggedInUserEmail ? "start" : "end";
            console.log(mess);
            return <Message key={id} justify={justify} message={message} />;
          })}
      </ul>
    </div>
  );
}
