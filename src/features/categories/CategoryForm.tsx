import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import ImagePreview from "../../app/components/ImagePreview";
import { Category } from "../../lib/repos/categoriesRepo";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  img: z.string().url("Image URL must be valid").optional().or(z.literal(""))
});

export type CategoryFormValues = z.infer<typeof schema>;

interface CategoryFormProps {
  open: boolean;
  initialValues?: Category;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void;
}

const CategoryForm = ({ open, initialValues, onClose, onSubmit }: CategoryFormProps) => {
  const { register, handleSubmit, watch, formState } = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      img: initialValues?.img ?? ""
    }
  });

  const imgValue = watch("img");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValues ? "Edit category" : "New category"}</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
        <TextField label="Name" {...register("name")} error={!!formState.errors.name} helperText={formState.errors.name?.message} />
        <TextField
          label="Image URL"
          {...register("img")}
          error={!!formState.errors.img}
          helperText={formState.errors.img?.message}
        />
        <Box>
          <ImagePreview src={imgValue} label="Preview" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryForm;
