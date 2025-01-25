// src/utils/exportUtils.js
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export const exportUtils = {
  toPDF: (data, title) => {
    const doc = new jsPDF();
    doc.text(title || 'MTI Analytics Report', 20, 10);
    
    // Add report content
    let yPosition = 30;
    Object.entries(data).forEach(([key, value]) => {
      doc.text(`${key}: ${JSON.stringify(value)}`, 20, yPosition);
      yPosition += 10;
    });

    doc.save(`mti-report-${new Date().toISOString()}.pdf`);
  },

  toExcel: (data, title) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, title || 'Report');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `mti-report-${new Date().toISOString()}.xlsx`);
  },

  toCSV: (data) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `mti-report-${new Date().toISOString()}.csv`);
  }
};