import { ExportData } from "@/components/export-button";
import ExcelJs from "exceljs";
import { saveAs } from "file-saver";

interface DownloadExcelFileProps {
  exportData: ExportData;
  fileName: string;
  userFullName: string;
  email: string;
  reportMessage: string;
}

export async function downloadExcelFile<T>({
  exportData,
  fileName,
  userFullName,
  email,
  reportMessage
}: DownloadExcelFileProps) {
  const NUM_COLS = 14;
  const HEADER_ROWS = 5;
  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet("Reporte");
  sheet.pageSetup.fitToPage = true;
  sheet.pageSetup.fitToWidth = 1;

  for (let i = 1; i <= NUM_COLS; i++) {
    for (let j = 0; j <= HEADER_ROWS; j++) {
      sheet.getCell(j, i).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "18181b" }
      };
    }
  }

  sheet.mergeCells("A3:H3");
  sheet.getCell("A3").value = reportMessage;
  sheet.getCell("A3").font = { bold: true, color: { argb: "FFFFFF" } };

  sheet.mergeCells("M1:N5");
  // const result = await toDataURL(logo);
  // const image = workbook.addImage({
  //   base64: result.base64Url as string,
  //   extension: "png"
  // });
  // sheet.addImage(image, "M1:N5");

  sheet.mergeCells("D7:K7");
  sheet.getCell("D7").value = exportData.title;
  sheet.getCell("D7").alignment = { horizontal: "center" };
  sheet.getCell("D7").font = { bold: true };

  const START_ROW = 9;
  const START_COL = Math.round((NUM_COLS - exportData.columns.length) / 2) + 1;

  exportData.columns.forEach((col, i) => {
    sheet.getColumn(i + START_COL).width = 20;
    sheet.getCell(START_ROW, i + START_COL).value = col.title;
    sheet.getCell(START_ROW, i + START_COL).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    };
  });

  exportData.records.forEach((rec, i) => {
    exportData.columns.forEach((col, j) => {
      sheet.getCell(START_ROW + i + 1, j + START_COL).value = rec[col.accessor] as string;
      sheet.getCell(START_ROW + i + 1, j + START_COL).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });
  });
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    saveAs(blob, fileName);
  });
}
