import { apiSlice } from "../api/apiSlice";
import { messagesApi } from "../messages/messagesApi";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    conversations: builder.query({
      query: (email) => ({
        url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`,
      }),
    }),
    getConversation: builder.query({
      query: ({ loggedInUserEmail, partnerEmail }) => ({
        url: `/conversations?participants_like=${loggedInUserEmail}-${partnerEmail}&&participants_like=${partnerEmail}-${loggedInUserEmail}`,
      }),
    }),
    addConversation: builder.mutation({
      query: ({ data, senderEmail }) => ({
        url: `/conversations`,
        method: "POST",
        body: data,
      }),
      // silent update to message table
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data?.id) {
            const updatedMessage = {
              conversationId: result.data.id,
              sender: result.data.users.find(
                (f) => f.email === arg.senderEmail
              ),
              receiver: result.data.users.find(
                (f) => f.email !== arg.senderEmail
              ),
              message: result.data.message,
              timestamp: result.data.timestamp,
            };

            dispatch(messagesApi.endpoints.addMessage.initiate(updatedMessage));
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data, senderEmail }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      // silent update to message table
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data?.id) {
            const updatedMessage = {
              conversationId: result.data.id,
              sender: result.data.users.find(
                (f) => f.email === arg.senderEmail
              ),
              receiver: result.data.users.find(
                (f) => f.email !== arg.senderEmail
              ),
              message: result.data.message,
              timestamp: result.data.timestamp,
            };

            dispatch(messagesApi.endpoints.addMessage.initiate(updatedMessage));
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useConversationsQuery,
  useAddConversationMutation,
  useEditConversationMutation,
  useGetConversationQuery,
} = conversationsApi;
