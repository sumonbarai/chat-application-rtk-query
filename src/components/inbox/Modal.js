import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationsApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/conversations/conversationsApi";

import { useGetUserQuery } from "../../features/users/usersApi";
import validEmail from "../../utils/validEmail";
import Error from "../ui/Error";

export default function Modal({ open, control }) {
  const { user: loggedInUserInformation } = useSelector((state) => state.auth);
  const { email: loggedInUserEmail } = useSelector((state) => state.auth.user);
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [userCheck, setUserChecked] = useState(false);
  const [conversation, setConversation] = useState(undefined);
  const { data: participant } = useGetUserQuery(to, {
    skip: !userCheck,
  });
  const [addConversation, { isSuccess: AddConversationSuccess }] =
    useAddConversationMutation();
  const [editConversation, { isSuccess: EditConversationSuccess }] =
    useEditConversationMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (to !== "") {
        const inputEmailValid = validEmail(to);

        if (inputEmailValid) {
          setUserChecked(true);
          if (
            participant?.length > 0 &&
            participant[0].email !== loggedInUserEmail
          ) {
            const participantEmail = participant[0].email;

            dispatch(
              conversationsApi.endpoints.getConversation.initiate({
                loggedInUserEmail: loggedInUserEmail,
                partnerEmail: participantEmail,
              })
            )
              .unwrap()
              .then((data) => {
                setConversation(data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      }
    }, 800);
    return () => {
      clearTimeout(timeOut);
    };
  }, [to, participant, loggedInUserEmail, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (conversation?.length > 0) {
      const data = {
        message: message,
        timestamp: new Date().getTime(),
      };
      editConversation({
        id: conversation[0].id,
        data: data,
        senderEmail: loggedInUserEmail,
      });
    } else if (conversation?.length === 0) {
      const data = {
        participants: `${loggedInUserInformation.email}-${participant[0].email}`,
        users: [
          {
            email: `${loggedInUserInformation.email}`,
            name: `${loggedInUserInformation.name}`,
            id: `${loggedInUserInformation.id}`,
          },
          {
            email: `${participant[0].email}`,
            name: `${participant[0].name}`,
            id: `${participant[0].id}`,
          },
        ],
        message: message,
        timestamp: new Date().getTime(),
      };
      addConversation(data);
    }
  };
  useEffect(() => {
    if (AddConversationSuccess || EditConversationSuccess) {
      control();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EditConversationSuccess, AddConversationSuccess]);
  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
                  conversation === undefined
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={conversation === undefined}
              >
                Send Message
              </button>
            </div>

            {participant?.length === 0 && (
              <Error message="Email address is not registered" />
            )}
            {participant?.length > 0 &&
              participant[0].email === loggedInUserEmail && (
                <Error message="You can't send message to your self" />
              )}
          </form>
        </div>
      </>
    )
  );
}
