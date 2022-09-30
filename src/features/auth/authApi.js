import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";

export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // register api
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const result = await queryFulfilled;
        // save register user data in localStorage
        localStorage.setItem(
          "auth",
          JSON.stringify({
            accessToken: result.data.accessToken,
            user: result.data.user,
          })
        );
        // save register user data in authSlice
        dispatch(
          userLoggedIn({
            accessToken: result.data.accessToken,
            user: result.data.user,
          })
        );
      },
    }),
    // login api
    loggedIn: builder.mutation({
      query: (data) => ({
        url: `/login`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const result = await queryFulfilled;
        localStorage.setItem(
          "auth",
          JSON.stringify({
            accessToken: result.data.accessToken,
            user: result.data.user,
          })
        );
        dispatch(
          userLoggedIn({
            accessToken: result.data.accessToken,
            user: result.data.user,
          })
        );
      },
    }),
  }),
});

export const { useRegisterMutation, useLoggedInMutation } = authSlice;
