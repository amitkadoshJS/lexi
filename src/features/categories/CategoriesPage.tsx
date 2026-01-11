import { useMemo, useState } from "react";
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import PageHeader from "../../app/components/PageHeader";
import LoadingState from "../../app/components/LoadingState";
import EmptyState from "../../app/components/EmptyState";
import ConfirmDialog from "../../app/components/ConfirmDialog";
import ImagePreview from "../../app/components/ImagePreview";
import CategoryForm, { CategoryFormValues } from "./CategoryForm";
import { categoriesRepo, Category } from "../../lib/repos/categoriesRepo";
import { useSnack } from "../../app/hooks/useSnack";

const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const snack = useSnack();
  const [active, setActive] = useState<Category | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesRepo.list
  });

  const createMutation = useMutation({
    mutationFn: categoriesRepo.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      snack.success("Category created");
      setOpenForm(false);
    },
    onError: () => snack.error("Failed to create category")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Category> }) =>
      categoriesRepo.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      snack.success("Category updated");
      setOpenForm(false);
    },
    onError: () => snack.error("Failed to update category")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesRepo.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      snack.success("Category deleted");
      setDeleteTarget(null);
    },
    onError: () => snack.error("Failed to delete category")
  });

  const rows = useMemo(() => data ?? [], [data]);

  const handleSubmit = (values: CategoryFormValues) => {
    if (active?.id) {
      updateMutation.mutate({ id: active.id, payload: values });
    } else {
      createMutation.mutate({ ...values, img: values.img ?? "" });
    }
  };

  return (
    <Box>
      <PageHeader title="Categories" actionLabel="New category" onAction={() => { setActive(null); setOpenForm(true); }} />
      {isLoading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState label="No categories yet." />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Image</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.created_at ? dayjs(row.created_at.toDate()).format("YYYY-MM-DD") : "-"}</TableCell>
                <TableCell>
                  <ImagePreview src={row.img} label={row.name} />
                </TableCell>
                <TableCell align="right">
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

      <CategoryForm
        open={openForm}
        initialValues={active ?? undefined}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete category"
        description="Are you sure you want to delete this category?"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget?.id && deleteMutation.mutate(deleteTarget.id)}
      />
    </Box>
  );
};

export default CategoriesPage;
