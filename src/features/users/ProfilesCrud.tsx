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
import ConfirmDialog from "../../app/components/ConfirmDialog";
import EmptyState from "../../app/components/EmptyState";
import LoadingState from "../../app/components/LoadingState";
import { useSnack } from "../../app/hooks/useSnack";
import {
  createSubcollectionDoc,
  deleteSubcollectionDoc,
  GenericRecord,
  listSubcollection,
  updateSubcollectionDoc
} from "../../lib/utils/firestore";

interface ProfilesCrudProps {
  userId: string;
}

const ProfilesCrud = ({ userId }: ProfilesCrudProps) => {
  const snack = useSnack();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<GenericRecord | null>(null);
  const [jsonText, setJsonText] = useState("{}");
  const [deleteTarget, setDeleteTarget] = useState<GenericRecord | null>(null);

  const queryKey = ["users", userId, "profiles"];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => listSubcollection(["users", userId, "Profiles"])
  });

  const createMutation = useMutation({
    mutationFn: (payload: GenericRecord) =>
      createSubcollectionDoc(["users", userId, "Profiles"], payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      snack.success("Profile created");
      setOpen(false);
    },
    onError: () => snack.error("Failed to create profile")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: GenericRecord }) =>
      updateSubcollectionDoc(["users", userId, "Profiles"], id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      snack.success("Profile updated");
      setOpen(false);
    },
    onError: () => snack.error("Failed to update profile")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSubcollectionDoc(["users", userId, "Profiles"], id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      snack.success("Profile deleted");
      setDeleteTarget(null);
    },
    onError: () => snack.error("Failed to delete profile")
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" onClick={() => openDialog()}>
          Add profile
        </Button>
      </Box>
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
        <EmptyState label="No profiles yet." />
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{active ? "Edit profile" : "New profile"}</DialogTitle>
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
        title="Delete profile"
        description="Are you sure you want to delete this profile?"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget?.id && deleteMutation.mutate(deleteTarget.id)}
      />
    </Box>
  );
};

export default ProfilesCrud;
