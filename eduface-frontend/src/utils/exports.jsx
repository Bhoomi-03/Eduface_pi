import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// CSV Export
export const exportToCSV = (data, filename = 'report.csv') => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Excel Export
export const exportToExcel = (data, sheetName = 'Sheet1', filename = 'report.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
};

// Convert attendance data to export format
export const prepareAttendanceExport = (records) => {
  return records.map((r) => ({
    'Student Name': r.studentName,
    'USN': r.rollNumber,
    'Date': r.date,
    'Time': r.time,
    'Status': r.status,
  }));
};

// Convert students data to export format
export const prepareStudentsExport = (students) => {
  return students.map((s) => ({
    'Name': s.name,
    'USN': s.usn,
    'Department': s.department,
    'Semester': s.sem,
    'Section': s.section,
    'Parent Contact': s.parent_number,
  }));
};
