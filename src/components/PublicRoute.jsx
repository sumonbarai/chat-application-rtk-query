import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const authExist = useAuth();
  if (!authExist) {
    return children;
  } else {
    return <Navigate to={"/inbox"} replace={true} />;
  }
};

export default PublicRoute;
