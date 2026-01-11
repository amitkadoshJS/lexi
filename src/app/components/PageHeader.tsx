import { Box, Button, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const PageHeader = ({ title, actionLabel, onAction }: PageHeaderProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="h5" fontWeight={600}>
        {title}
      </Typography>
      {actionLabel && onAction ? (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  );
};

export default PageHeader;
