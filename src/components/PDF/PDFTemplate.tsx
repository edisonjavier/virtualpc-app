import { TableColumns } from "@/types/table.type";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { useMemo } from "react";
const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    fontSize: "10px"
  },
  tableRow: {
    width: "100%",
    margin: "auto",
    flexDirection: "row",
    borderBottomWidth: 1
  },
  tableHeader: {
    fontWeight: "bold",
    color: "white"
  },
  tableCol: {
    borderStyle: "solid"
  },
  tableCell: {
    padding: "5px 5px 5px 0",
    marginTop: 5,
    fontSize: 10
  },
  title: {
    textAlign: "center",
    margin: "10px 0"
  }
});

export type CellValue = string | string[];

const MAX_TEXT_LENGTH = 20;
const MAX_COLUMN_WIDTH = MAX_TEXT_LENGTH - 5;

export default function PDFTable<T>({ columns, records }: { columns: TableColumns[]; records: T[] }) {
  const getMaxLength = (record: CellValue): number => {
    let currentMaxColumnLength: number = Array.isArray(record)
      ? Math.max(...(record as string[]).map((val) => val.length))
      : (record as string).toString().length;
    return currentMaxColumnLength > MAX_TEXT_LENGTH ? MAX_TEXT_LENGTH : currentMaxColumnLength;
  };

  const tableData = useMemo(() => {
    // Longitud máxima de cada columna
    const maxColumnLengths = columns.reduce(
      (prev, col) => {
        const maxLength = Math.max(
          ...records.map((record) => {
            return getMaxLength(record[col.accessor as keyof T] as CellValue);
          })
        );
        return {
          ...prev,
          [col.accessor]: maxLength
        };
      },
      {} as Record<string, number>
    );

    // % de ancho para cada columna
    const totalLength = Object.values(maxColumnLengths).reduce((total, len) => total + len, 0);
    const columnWidths = columns.reduce(
      (prev, col) => {
        const columnLength =
          maxColumnLengths[col.accessor] >= MAX_TEXT_LENGTH
            ? MAX_COLUMN_WIDTH
            : maxColumnLengths[col.accessor];
        const width = `${Math.round((columnLength / totalLength) * 100).toFixed(2)}%`;
        return {
          ...prev,
          [col.accessor]: width
        };
      },
      {} as Record<string, string>
    );
    return {
      maxColumnLengths,
      columnWidths
    };
  }, [columns, records]);

  const getCellValue = (record: CellValue): string => {
    let cellValue = "";
    if (Array.isArray(record)) {
      cellValue = record.join(", \n");
    } else {
      const regex = new RegExp(`\\b.{1,${MAX_TEXT_LENGTH}}\\b`, "g");
      cellValue =
        record.length > MAX_TEXT_LENGTH ? ((record as string).match(regex)?.join("\n") as string) : record;
    }

    return cellValue;
  };

  return (
    <View style={styles.table}>
      <View style={{ ...styles.tableRow, backgroundColor: "#18181b" }}>
        {columns.map((col) => (
          <View
            key={col.title}
            style={{ ...styles.tableCol, width: tableData.columnWidths[col.accessor], marginRight: 5 }}
          >
            <Text style={{ ...styles.tableHeader, ...styles.tableCell }}>{col.title}</Text>
          </View>
        ))}
      </View>
      {records.map((rec, idx) => (
        <View key={`row${idx}`} style={styles.tableRow}>
          {columns.map((col) => (
            <View
              key={`${col.accessor.toString()}${idx}`}
              style={{ ...styles.tableCol, width: tableData.columnWidths[col.accessor], marginRight: 5 }}
            >
              <Text style={styles.tableCell}>{getCellValue(rec[col.accessor as keyof T] as CellValue)}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
