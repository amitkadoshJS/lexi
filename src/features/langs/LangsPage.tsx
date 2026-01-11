import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../app/components/PageHeader";
import EmptyState from "../../app/components/EmptyState";
import LoadingState from "../../app/components/LoadingState";
import ConfirmDialog from "../../app/components/ConfirmDialog";
import { useSnack } from "../../app/hooks/useSnack";
import { GenericRecord, langsRepo } from "../../lib/repos/langsRepo";

const LangsPage = () => {
  const snack = useSnack();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<GenericRecord | null>(null);
  const [jsonText, setJsonText] = useState("{}");
  const [deleteTarget, setDeleteTarget] = useState<GenericRecord | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["langs"],
    queryFn: langsRepo.list
  });

  const createMutation = useMutation({
    mutationFn: (payload: GenericRecord) => langsRepo.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["langs"] });
      snack.success("Lang document created");
      setOpen(false);
    },
    onError: () => snack.error("Failed to create lang document")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: GenericRecord }) =>
      langsRepo.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["langs"] });
      snack.success("Lang document updated");
      setOpen(false);
    },
    onError: () => snack.error("Failed to update lang document")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => langsRepo.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["langs"] });
      snack.success("Lang document deleted");
      setDeleteTarget(null);
    },
    onError: () => snack.error("Failed to delete lang document")
  });

  const openDialog = (record?: GenericRecord) => {
    setActive(record ?? null);
    setJsonText(JSON.stringify(record ?? {}, null, 2));
    setOpen(true);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText || "{}");
      if (active?.id) {
        updateMutation.mutate({ id: active.id, payload: parsed });
      } else {
        createMutation.mutate(parsed);
      }
    } catch {
      snack.error("Invalid JSON");
    }
  };

  return (
    <Box>
      <PageHeader title="Langs" actionLabel="New document" onAction={() => openDialog()} />
      {isLoading ? (
        <LoadingState />
      ) : data?.length ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{JSON.stringify(row).slice(0, 120)}...</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openDialog(row)}>
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
      ) : (
        <EmptyState label="No lang documents yet." />
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{active ? "Edit document" : "New document"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="JSON"
            multiline
            minRows={8}
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete document"
        description="Are you sure you want to delete this document?"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget?.id && deleteMutation.mutate(deleteTarget.id)}
      />
    </Box>
  );
};

export default LangsPage;
