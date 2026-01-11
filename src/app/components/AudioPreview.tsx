import { Box, Link, Typography } from "@mui/material";

const AudioPreview = ({ src }: { src?: string }) => {
  if (!src) {
    return (
      <Typography variant="caption" color="text.secondary">
        No audio
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <audio controls src={src} style={{ maxWidth: 240 }} />
      <Link href={src} target="_blank" rel="noreferrer">
        Open link
      </Link>
    </Box>
  );
};

export default AudioPreview;
