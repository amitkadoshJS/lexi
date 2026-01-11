import { useState } from "react";
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../app/components/PageHeader";
import LoadingState from "../../app/components/LoadingState";
import EmptyState from "../../app/components/EmptyState";
import ConfirmDialog from "../../app/components/ConfirmDialog";
import ImagePreview from "../../app/components/ImagePreview";
import WorldForm, { WorldFormValues } from "./WorldForm";
import { useSnack } from "../../app/hooks/useSnack";
import { World, worldsRepo } from "../../lib/repos/worldsRepo";

const WorldsPage = () => {
  const queryClient = useQueryClient();
  const snack = useSnack();
  const navigate = useNavigate();
  const [active, setActive] = useState<World | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<World | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["worlds"],
    queryFn: worldsRepo.list
  });

  const createMutation = useMutation({
    mutationFn: worldsRepo.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worlds"] });
      snack.success("World created");
      setOpenForm(false);
    },
    onError: () => snack.error("Failed to create world")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<World> }) =>
      worldsRepo.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worlds"] });
      snack.success("World updated");
      setOpenForm(false);
    },
    onError: () => snack.error("Failed to update world")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => worldsRepo.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worlds"] });
      snack.success("World deleted");
      setDeleteTarget(null);
    },
    onError: () => snack.error("Failed to delete world")
  });

  const handleSubmit = (values: WorldFormValues) => {
    if (active?.id) {
      updateMutation.mutate({ id: active.id, payload: values });
    } else {
      createMutation.mutate(values as World);
    }
  };

  const rows = data ?? [];

  return (
    <Box>
      <PageHeader title="Worlds" actionLabel="New world" onAction={() => { setActive(null); setOpenForm(true); }} />
      {isLoading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState label="No worlds yet." />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Title (EN)</TableCell>
              <TableCell>Title (HE)</TableCell>
              <TableCell>Image</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.orderId}</TableCell>
                <TableCell>{row.title_en}</TableCell>
                <TableCell>{row.title_he}</TableCell>
                <TableCell>
                  <ImagePreview src={row.img} label={row.title_en} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/worlds/${row.id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => { setActive(row); setOpenForm(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => setDeleteTarget(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <WorldForm
        open={openForm}
        initialValues={active}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete world"
        description="Are you sure you want to delete this world?"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget?.id && deleteMutation.mutate(deleteTarget.id)}
      />
    </Box>
  );
};

export default WorldsPage;
