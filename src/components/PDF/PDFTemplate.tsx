"use client";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

const styles = StyleSheet.create({
  footerImg: {
    height: "60px"
  },
  body: {
    paddingBottom: 65
  },
  footer: {
    position: "absolute",
    bottom: "5px",
    right: 0,
    left: 0
  },
  logo: {
    height: "100rem",
    width: "100rem",
    position: "absolute",
    top: "40px",
    right: "20px"
  },
  text: {
    fontSize: "10px",
    textAlign: "center"
  },
  date: {
    marginTop: "20px",
    marginLeft: "20px",
    fontSize: "11px"
  },
  contactInfo: {
    color: "green"
  },
  container: {
    padding: "16px",
    overflow: "hidden"
  }
});

interface PDFTemplateProps {
  message: string;
  children: JSX.Element | JSX.Element[];
}

export default function PDFTemplate({ children, message }: PDFTemplateProps) {
  return (
    <Document>
      <Page style={styles.body}>
        {/* <View fixed>
          <Image src={header} />
          <Image src={logo} style={styles.logo} />
        </View> */}
        <Text style={styles.date}>{message}</Text>
        <View style={styles.container}>{children}</View>
        {/* <View fixed style={styles.footer}>
          <Image src={footer} style={styles.footerImg} />
        </View> */}
      </Page>
    </Document>
  );
}
