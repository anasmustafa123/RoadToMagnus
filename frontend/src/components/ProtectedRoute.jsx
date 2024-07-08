import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function ProtectedRoute({ component }) {
  const { isUser } = useContext(UserContext);
  !isUser ? console.error("no no") : "";
  return isUser ? component : <Navigate to="/login" />;
}
