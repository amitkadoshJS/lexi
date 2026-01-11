import { Box, TextField } from "@mui/material";

interface JsonEditorProps {
  label: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
}

const JsonEditor = ({ label, value, onChange }: JsonEditorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    try {
      const parsed = JSON.parse(nextValue);
      onChange(parsed);
    } catch {
      onChange(value);
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        multiline
        minRows={6}
        defaultValue={JSON.stringify(value, null, 2)}
        onBlur={handleChange}
        helperText="Edit JSON and blur to apply changes"
      />
    </Box>
  );
};

export default JsonEditor;
