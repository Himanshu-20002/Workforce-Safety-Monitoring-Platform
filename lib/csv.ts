/**
 * CSV export utilities
 */

export function generateCSV(data: Record<string, any>[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const headerLine = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',');
  const rowLines = data.map((item) =>
    headers
      .map((h) => {
        const val = item[h];
        const strVal = val instanceof Date ? val.toLocaleString() : String(val ?? '');
        return `"${strVal.replace(/"/g, '""')}"`;
      })
      .join(',')
  );
  return [headerLine, ...rowLines].join('\n');
}

export function downloadCSV(data: Record<string, any>[], filename: string): void {
  const csvContent = generateCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
