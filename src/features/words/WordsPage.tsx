import { useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../app/components/PageHeader";
import LoadingState from "../../app/components/LoadingState";
import EmptyState from "../../app/components/EmptyState";
import ConfirmDialog from "../../app/components/ConfirmDialog";
import WordForm, { WordFormValues } from "./WordForm";
import { Word, wordsRepo } from "../../lib/repos/wordsRepo";
import { useSnack } from "../../app/hooks/useSnack";
import { exportToCsv, parseCsvFile } from "../../lib/utils/csv";

const PAGE_SIZE = 25;

const normalizeCategory = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const WordsPage = () => {
  const snack = useSnack();
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [active, setActive] = useState<Word | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Word | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const wordsQuery = useInfiniteQuery({
    queryKey: ["words"],
    queryFn: ({ pageParam }) => wordsRepo.listPage(PAGE_SIZE, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.lastId
  });

  const createMutation = useMutation({
    mutationFn: wordsRepo.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words"] });
      snack.success("Word created");
      setOpenForm(false);
    },
    onError: () => snack.error("Failed to create word")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Word> }) =>
      wordsRepo.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words"] });
      snack.success("Word updated");
      setOpenForm(false);
    },
    onError: () => snack.error("Failed to update word")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => wordsRepo.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words"] });
      snack.success("Word deleted");
      setDeleteTarget(null);
    },
    onError: () => snack.error("Failed to delete word")
  });

  const duplicateMutation = useMutation({
    mutationFn: (payload: Word) => {
      const { id, ...rest } = payload;
      return wordsRepo.create(rest as Word);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words"] });
      snack.success("Word duplicated");
    },
    onError: () => snack.error("Failed to duplicate word")
  });

  const rows = useMemo(() => {
    const items = wordsQuery.data?.pages.flatMap((page) => page.items) ?? [];
    const searchLower = search.toLowerCase();
    return items.filter((word) => {
      const matchesSearch =
        word.title_en.toLowerCase().includes(searchLower) ||
        word.title_he.toLowerCase().includes(searchLower);
      const matchesCategory = categoryFilter
        ? word.category.some((cat) => cat.toLowerCase().includes(categoryFilter.toLowerCase()))
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [wordsQuery.data, search, categoryFilter]);

  const handleSubmit = (values: WordFormValues) => {
    if (active?.id) {
      updateMutation.mutate({ id: active.id, payload: values });
    } else {
      createMutation.mutate(values as Word);
    }
  };

  const handleExport = () => {
    const exportRows = rows.map((row) => ({
      id: row.id,
      title_en: row.title_en,
      title_he: row.title_he,
      category: row.category.join(","),
      img: row.img,
      corr_img: row.corr_img,
      voice_record_en: row.voice_record_en,
      voice_record_he: row.voice_record_he,
      test_order_id: row.test_order_id
    }));
    exportToCsv("words.csv", exportRows);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const rows = await parseCsvFile(file);
      for (const row of rows) {
        const payload: Word = {
          title_en: row.title_en ?? "",
          title_he: row.title_he ?? "",
          category: normalizeCategory(row.category),
          img: row.img ?? "",
          corr_img: row.corr_img ?? "",
          voice_record_en: row.voice_record_en ?? "",
          voice_record_he: row.voice_record_he ?? "",
          test_order_id: Number(row.test_order_id ?? 0)
        };
        if (row.id) {
          await wordsRepo.update(String(row.id), payload);
        } else {
          await wordsRepo.create(payload);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["words"] });
      snack.success("CSV import complete");
      event.target.value = "";
    } catch (error) {
      snack.error("Failed to import CSV");
    }
  };

  return (
    <Box>
      <PageHeader title="Words" actionLabel="New word" onAction={() => { setActive(null); setOpenForm(true); }} />
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
          <TextField
            label="Search title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            fullWidth
          />
          <TextField
            label="Filter category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            fullWidth
          />
          <Button startIcon={<DownloadIcon />} variant="outlined" onClick={handleExport}>
            Export CSV
          </Button>
          <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
            Import CSV
            <input hidden type="file" accept=".csv" onChange={handleImport} />
          </Button>
        </Stack>
      </Paper>

      {wordsQuery.isLoading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState label="No words found." />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title (EN)</TableCell>
              <TableCell>Title (HE)</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Order</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.title_en}</TableCell>
                <TableCell>{row.title_he}</TableCell>
                <TableCell>
                  <Typography variant="body2">{row.category.join(", ")}</Typography>
                </TableCell>
                <TableCell>{row.test_order_id}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => { setActive(row); setOpenForm(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => duplicateMutation.mutate(row)}>
                    <ContentCopyIcon />
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

      {wordsQuery.hasNextPage ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="outlined" onClick={() => wordsQuery.fetchNextPage()}>
            Load more
          </Button>
        </Box>
      ) : null}

      <WordForm
        open={openForm}
        initialValues={active}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete word"
        description="Are you sure you want to delete this word?"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget?.id && deleteMutation.mutate(deleteTarget.id)}
      />
    </Box>
  );
};

export default WordsPage;
