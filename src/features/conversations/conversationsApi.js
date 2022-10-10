import { apiSlice } from "../api/apiSlice";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builders) => ({
    conversations: builders.query({
      query: (email) => ({
        url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`,
      }),
    }),
    getConversation: builders.query({
      query: ({ loggedInUserEmail, partnerEmail }) => ({
        url: `/conversations?participants_like=${loggedInUserEmail}-${partnerEmail}&${partnerEmail}-${loggedInUserEmail}`,
      }),
    }),
  }),
});

export const { useConversationsQuery, useGetConversationQuery } =
  conversationsApi;
