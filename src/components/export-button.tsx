"use client";
import { TableColumns } from "@/types/table.type";
import { downloadExcelFile } from "@/utils";
import { Button, Menu } from "@mantine/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { IconFileDownload, IconFileSpreadsheet, IconPdf } from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useSession } from "next-auth/react";
import { PDFExportDocument } from "./PDF";
dayjs.locale("es");

export type ExportType = Record<string, string>;

export interface ExportData {
  columns: TableColumns[];
  records: ExportType[];
  title: string;
}

export default function ExportButton({ exportData, fileName }: { exportData: ExportData; fileName: string }) {
  const { data } = useSession();
  const GENERATED_REPORT_MESSAGE = `Reporte generado el ${dayjs().format("DD [de] MMMM [de] YYYY")} por ${data
    ?.user.person.names} ${data?.user.person.surnames} ${data?.user.email}`;

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button color="green" leftSection={<IconFileDownload />}>
          Exportar
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label className="text-center">Exportar</Menu.Label>
        <PDFDownloadLink
          document={
            <PDFExportDocument
              columns={exportData.columns}
              records={exportData.records}
              title={exportData.title}
              reportMessage={GENERATED_REPORT_MESSAGE}
            />
          }
          fileName={`${fileName}.pdf`}
        >
          <Menu.Item leftSection={<IconPdf size={14} color="red" />}>PDF</Menu.Item>
        </PDFDownloadLink>
        <Menu.Item
          onClick={() =>
            downloadExcelFile({
              exportData,
              fileName: `${fileName}.xlsx`,
              email: data?.user.email ?? "",
              userFullName: `${data?.user.person.names} ${data?.user.person.surnames}`,
              reportMessage: GENERATED_REPORT_MESSAGE
            })
          }
          leftSection={<IconFileSpreadsheet size={14} color="green" />}
        >
          Excel
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
