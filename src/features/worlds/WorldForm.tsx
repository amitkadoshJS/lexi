import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import ImagePreview from "../../app/components/ImagePreview";
import { World } from "../../lib/repos/worldsRepo";

const schema = z.object({
  title_en: z.string().min(1, "Title (EN) is required"),
  title_he: z.string().min(1, "Title (HE) is required"),
  img: z.string().url("Image URL must be valid").optional().or(z.literal("")),
  orderId: z.coerce.number().int().nonnegative()
});

export type WorldFormValues = z.infer<typeof schema>;

interface WorldFormProps {
  open: boolean;
  initialValues?: World | null;
  onClose: () => void;
  onSubmit: (values: WorldFormValues) => void;
}

const WorldForm = ({ open, initialValues, onClose, onSubmit }: WorldFormProps) => {
  const { register, handleSubmit, watch, formState } = useForm<WorldFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_en: initialValues?.title_en ?? "",
      title_he: initialValues?.title_he ?? "",
      img: initialValues?.img ?? "",
      orderId: initialValues?.orderId ?? 0
    }
  });

  const imgValue = watch("img");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValues ? "Edit world" : "New world"}</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
        <TextField
          label="Title (EN)"
          {...register("title_en")}
          error={!!formState.errors.title_en}
          helperText={formState.errors.title_en?.message}
        />
        <TextField
          label="Title (HE)"
          {...register("title_he")}
          error={!!formState.errors.title_he}
          helperText={formState.errors.title_he?.message}
        />
        <TextField
          label="Image URL"
          {...register("img")}
          error={!!formState.errors.img}
          helperText={formState.errors.img?.message}
        />
        <ImagePreview src={imgValue} label="Image preview" />
        <TextField
          label="Order ID"
          type="number"
          {...register("orderId")}
          error={!!formState.errors.orderId}
          helperText={formState.errors.orderId?.message}
        />
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

export default WorldForm;
