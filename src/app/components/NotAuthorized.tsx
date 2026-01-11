import { Box, Card, CardContent, Typography } from "@mui/material";

const NotAuthorized = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Card sx={{ maxWidth: 480, width: "100%" }}>
        <CardContent sx={{ display: "grid", gap: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            Not authorized
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your account is not listed under config/admins. Contact an administrator to be
            granted access.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotAuthorized;
