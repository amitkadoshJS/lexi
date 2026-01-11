import Papa from "papaparse";

export const exportToCsv = (filename: string, rows: Record<string, any>[]) => {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCsvFile = (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, any>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: (error) => reject(error)
    });
  });
};
