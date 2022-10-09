import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const authExist = useAuth();
  if (authExist) {
    return children;
  } else {
    return <Navigate to={"/"} replace={true} />;
  }
};

export default PrivateRoute;
