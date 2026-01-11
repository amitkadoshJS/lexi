import { Box, Typography } from "@mui/material";

const ImagePreview = ({ src, label }: { src?: string; label?: string }) => {
  if (!src) {
    return (
      <Typography variant="caption" color="text.secondary">
        {label ?? "No image"}
      </Typography>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={label ?? "preview"}
      sx={{ width: 80, height: 80, borderRadius: 1, objectFit: "cover", border: "1px solid #ddd" }}
    />
  );
};

export default ImagePreview;
