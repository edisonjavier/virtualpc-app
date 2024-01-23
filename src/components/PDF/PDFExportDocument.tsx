"use client";
import { TableColumns } from "@/types/table.type";
import { StyleSheet, Text } from "@react-pdf/renderer";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { PDFTable, PDFTemplate } from ".";
import { ExportType } from "../export-button";
dayjs.locale("es");

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: "15px",
    marginBottom: "10px",
    marginTop: "10px"
  }
});

interface PDFExportDocumentProps {
  columns: TableColumns[];
  records: ExportType[];
  title: string;
  reportMessage: string;
}

export default function PDFExportDocument({
  columns,
  records,
  title,
  reportMessage
}: PDFExportDocumentProps) {
  return (
    <PDFTemplate message={reportMessage}>
      <Text style={styles.title}>{title}</Text>
      <PDFTable columns={columns} records={records} />
    </PDFTemplate>
  );
}
