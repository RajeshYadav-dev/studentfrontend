import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
};

export default AuthGuard;
// Compare this snippet from frontend/src/App.jsx:
// import "./App.css";