import { Box, Typography } from "@mui/material";

const EmptyState = ({ label = "No records found." }: { label?: string }) => {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};

export default EmptyState;
