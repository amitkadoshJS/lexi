import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { signIn } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Card sx={{ maxWidth: 420, width: "100%" }}>
        <CardContent sx={{ display: "grid", gap: 2 }}>
          <Typography variant="h5" fontWeight={600}>
            Lexi Admin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in with Google to manage Firestore data.
          </Typography>
          <Button variant="contained" startIcon={<GoogleIcon />} onClick={signIn}>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
