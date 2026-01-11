import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImagePreview from "../../app/components/ImagePreview";
import AudioPreview from "../../app/components/AudioPreview";
import { Word } from "../../lib/repos/wordsRepo";

const schema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_he: z.string().min(1, "Hebrew title is required"),
  category: z.array(z.string()).default([]),
  img: z.string().url("Image URL must be valid").optional().or(z.literal("")),
  corr_img: z.string().url("Correct image URL must be valid").optional().or(z.literal("")),
  voice_record_en: z.string().url("Voice URL must be valid").optional().or(z.literal("")),
  voice_record_he: z.string().url("Voice URL must be valid").optional().or(z.literal("")),
  test_order_id: z.coerce.number().int().nonnegative()
});

export type WordFormValues = z.infer<typeof schema>;

interface WordFormProps {
  open: boolean;
  initialValues?: Word | null;
  onClose: () => void;
  onSubmit: (values: WordFormValues) => void;
}

const WordForm = ({ open, initialValues, onClose, onSubmit }: WordFormProps) => {
  const { register, control, handleSubmit, watch, formState } = useForm<WordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_en: initialValues?.title_en ?? "",
      title_he: initialValues?.title_he ?? "",
      category: initialValues?.category ?? [],
      img: initialValues?.img ?? "",
      corr_img: initialValues?.corr_img ?? "",
      voice_record_en: initialValues?.voice_record_en ?? "",
      voice_record_he: initialValues?.voice_record_he ?? "",
      test_order_id: initialValues?.test_order_id ?? 0
    }
  });

  const { fields, append, remove } = useFieldArray<any>({ control, name: "category" });
  const [newCategory, setNewCategory] = useState("");
  const categories = watch("category");

  const addCategory = () => {
    if (!newCategory.trim()) {
      return;
    }
    append(newCategory.trim());
    setNewCategory("");
  };

  const imgValue = watch("img");
  const corrImgValue = watch("corr_img");
  const audioEn = watch("voice_record_en");
  const audioHe = watch("voice_record_he");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialValues ? "Edit word" : "New word"}</DialogTitle>
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
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Categories
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
            {fields.map((field, index) => (
              <Chip key={field.id} label={categories?.[index] ?? ""} onDelete={() => remove(index)} />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Add category"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              fullWidth
            />
            <IconButton color="primary" onClick={addCategory}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
        <TextField
          label="Image URL"
          {...register("img")}
          error={!!formState.errors.img}
          helperText={formState.errors.img?.message}
        />
        <ImagePreview src={imgValue} label="Image preview" />
        <TextField
          label="Correct Image URL"
          {...register("corr_img")}
          error={!!formState.errors.corr_img}
          helperText={formState.errors.corr_img?.message}
        />
        <ImagePreview src={corrImgValue} label="Correct image preview" />
        <TextField
          label="Voice record EN"
          {...register("voice_record_en")}
          error={!!formState.errors.voice_record_en}
          helperText={formState.errors.voice_record_en?.message}
        />
        <AudioPreview src={audioEn} />
        <TextField
          label="Voice record HE"
          {...register("voice_record_he")}
          error={!!formState.errors.voice_record_he}
          helperText={formState.errors.voice_record_he?.message}
        />
        <AudioPreview src={audioHe} />
        <TextField
          label="Test order ID"
          type="number"
          {...register("test_order_id")}
          error={!!formState.errors.test_order_id}
          helperText={formState.errors.test_order_id?.message}
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

export default WordForm;
