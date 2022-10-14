import gravatarUrl from "gravatar-url";
import { useSelector } from "react-redux";

export default function ChatHead({ message }) {
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const { email: loggedInUserEmail } = loggedInUser || {};

  const { sender, receiver } = message || {};
  const partnerEmail =
    sender.email === loggedInUserEmail ? receiver.email : sender.email;
  const partnerName =
    sender.email === loggedInUserEmail ? receiver.name : sender.name;

  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <img
        className="object-cover w-10 h-10 rounded-full"
        src={gravatarUrl(partnerEmail)}
        alt={partnerName}
      />
      <span className="block ml-2 font-bold text-gray-600">{partnerName}</span>
    </div>
  );
}
