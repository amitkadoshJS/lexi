import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingState = ({ label = "Loading..." }: { label?: string }) => {
  return (
    <Box sx={{ display: "grid", placeItems: "center", p: 4, gap: 1 }}>
      <CircularProgress size={32} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};

export default LoadingState;
