import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useAuthorized } from "../hooks/useAuthorized";
import LoginPage from "./LoginPage";

const AuthGate = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const { authorized, loading: authzLoading } = useAuthorized();

  if (loading || authzLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (!authorized) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

export default AuthGate;
