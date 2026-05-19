import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";

interface Props {
  children: React.ReactNode;
}

function ProtectedRoute({
  children,
}: Props) {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;