import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import LoadingState from "../../app/components/LoadingState";
import ImagePreview from "../../app/components/ImagePreview";
import { worldsRepo } from "../../lib/repos/worldsRepo";
import GamesCrud from "./GamesCrud";

const WorldDetails = () => {
  const { worldId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["worlds", worldId],
    queryFn: () => (worldId ? worldsRepo.get(worldId) : Promise.resolve(null)),
    enabled: !!worldId
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!data) {
    return (
      <Box>
        <Typography variant="h6">World not found</Typography>
        <Button onClick={() => navigate("/worlds")}>Back</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Button variant="text" onClick={() => navigate("/worlds")}>
        Back to worlds
      </Button>
      <Card>
        <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ImagePreview src={data.img} label={data.title_en} />
          <Box>
            <Typography variant="h6">{data.title_en}</Typography>
            <Typography variant="body2" color="text.secondary">
              {data.title_he}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Order: {data.orderId}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Box>
        <Typography variant="h6" gutterBottom>
          Games
        </Typography>
        {worldId ? <GamesCrud worldId={worldId} /> : null}
      </Box>
    </Box>
  );
};

export default WorldDetails;
