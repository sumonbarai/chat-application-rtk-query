import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/auth/authSlice";

const useAuthCheck = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const localAuth = localStorage.getItem("auth");
    if (localAuth) {
      const localAuthObj = JSON.parse(localAuth);
      if (localAuthObj.accessToken && localAuthObj.user) {
        dispatch(
          userLoggedIn({
            accessToken: localAuthObj.accessToken,
            user: localAuthObj.user,
          })
        );
      }
    }
    setAuthChecked(true);
  }, [dispatch]);
  return authChecked;
};
export default useAuthCheck;
