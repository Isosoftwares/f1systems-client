import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import logo from "../../assets/graphics/garagelogo.jpeg";

// Colors
const COLORS = {
  primary: "#D30000", // Bright Red
  dark: "#1A1A1A", // Deep Black
  text: "#333333", // Dark Gray text
  gray: "#666666",
  lightGray: "#F3F4F6",
  white: "#FFFFFF",
  accent: "#FFC107", // Gold/Yellow
  headerBg: "#F9FAFB",
  success: "#D30000", // Green for PAID
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.text,
    backgroundColor: "#FFFFFF",
    paddingBottom: 60,
  },
  // Header
  headerContainer: {
    flexDirection: "row",
    height: 120,
    marginBottom: 20,
  },
  headerLeft: {
    width: "50%",
    paddingTop: 20,
    paddingLeft: 40,
    justifyContent: "center",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    objectFit: "contain",
  },
  companyInfo: {
    marginTop: 5,
  },
  slogan: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 2,
  },
  contactText: {
    fontSize: 9,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2,
  },

  // Right Header Visuals
  headerRight: {
    width: "50%",
    height: "100%",
    position: "relative",
  },
  invoiceTitleBlock: {
    position: "absolute",
    top: 30,
    right: 40,
    alignItems: "flex-end",
  },
  invoiceTitleLarge: {
    fontSize: 32,
    fontWeight: "heavy",
    color: COLORS.white,
    letterSpacing: 4,
    marginBottom: 6,
  },
  invoiceMetadata: {
    flexDirection: "row",
    gap: 20,
  },
  metaItem: {
    alignItems: "flex-end",
  },
  metaLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 7,
    textTransform: "uppercase",
    marginBottom: 2,
    letterSpacing: 1,
  },
  metaValue: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },

  // Customer Section
  customerSection: {
    flexDirection: "row",
    marginHorizontal: 40,
    marginBottom: 15,
    gap: 30,
  },
  customerCol: {
    flex: 1,
    backgroundColor: COLORS.headerBg,
    padding: 15,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  sectionLabel: {
    fontSize: 7,
    color: COLORS.gray,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 6,
    letterSpacing: 1,
  },
  clientName: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 2,
  },
  clientDetail: {
    fontSize: 9,
    color: COLORS.text,
    marginBottom: 1,
  },

  // Table
  tableContainer: {
    marginHorizontal: 40,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 0,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    borderRadius: 6,
  },
  th: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 0,
    alignItems: "center",
  },
  td: {
    fontSize: 9,
    color: COLORS.text,
  },
  // Column Widths
  col1: {
    width: "8%",
    textAlign: "center",
  }, // No
  col2: {
    width: "47%",
    paddingLeft: 10,
  }, // Description
  col3: {
    width: "10%",
    textAlign: "center",
  }, // Qty
  col4: {
    width: "17%",
    textAlign: "right",
    paddingRight: 10,
  }, // Unit Price
  col5: { width: "18%", textAlign: "right", paddingRight: 15 }, // Total

  // Financials
  financialsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 40,
    marginTop: 10,
  },
  financialsBox: {
    width: "45%",
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  financialLabel: {
    fontSize: 9,
    color: COLORS.gray,
  },
  financialValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 0,
    position: "relative",
    overflow: "hidden",
    marginTop: 15,
    borderRadius: 6,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.white,
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.white,
  },

  // Footer & Notes
  footerSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  notesContainer: {
    marginHorizontal: 40,
    marginTop: 20,
    marginBottom: 10,
  },
  notesTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  notesText: {
    fontSize: 7,
    color: COLORS.gray,
    lineHeight: 1.5,
  },

  // Post Service Report
  reportPage: {
    padding: 40,
    backgroundColor: COLORS.white,
    fontFamily: "Helvetica",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 15,
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 2,
  },
  reportMetaLabel: {
    color: COLORS.gray,
    fontSize: 7,
    textTransform: "uppercase",
    marginBottom: 2,
    letterSpacing: 1,
  },
  reportMetaValue: {
    color: COLORS.dark,
    fontSize: 8,
    fontWeight: "bold",
  },
  reportSubtitle: {
    fontSize: 10,
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  reportSectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 15,
    marginBottom: 8,
  },
  reportText: {
    fontSize: 9,
    color: COLORS.dark,
    lineHeight: 1.5,
  },
  reportImagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
    justifyContent: "space-between",
  },
  reportImage: {
    width: "48%",
    height: 180,
    objectFit: "cover",
    borderRadius: 6,
    marginBottom: 15,
    border: "1px solid #E5E7EB",
  },
  
  watermark: {
    position: "absolute",
    top: 250,
    left: 80,
    opacity: 0.08,
    transform: "rotate(-45deg)",
    zIndex: -1,
  },
  watermarkText: {
    fontSize: 140,
    fontWeight: "black",
    color: COLORS.success,
    letterSpacing: 15,
  }
});

const InvoicePDF = ({ invoice, business }) => {
  const laborCharge = invoice.laborCharge || 0;
  const discount = invoice.discount || 0;
  const isPaid = invoice.status === "paid";

  const subTotal = invoice.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  const taxableAmount = Math.max(0, subTotal + laborCharge - discount);
  const taxAmount = invoice.vatEnabled ? taxableAmount * 0.16 : 0;
  const totalAmount = taxableAmount + taxAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* WATERMARK IF PAID */}
        {isPaid && (
          <View style={styles.watermark}>
            <Text style={styles.watermarkText}>PAID</Text>
          </View>
        )}

        {/* === HEADER BACKGROUND === */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 120,
          }}
        >
          <Svg
            height="100%"
            width="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <Path d="M0,0 L100,0 L100,100 L0,100 Z" fill={COLORS.white} />
            <Path d="M40,0 L100,0 L100,100 L55,100 Z" fill={isPaid ? COLORS.success : COLORS.primary} />
            <Path d="M0,0 L39.5,0 L54.5,100 L0,100 Z" fill={COLORS.dark} />
          </Svg>
        </View>

        {/* === HEADER CONTENT === */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image src={invoice.companySnapshot?.logo || logo} style={styles.logo} />
            <Text style={styles.slogan}>{invoice.companySnapshot?.name || "Ruiru Auto Garage"}</Text>
            <Text style={styles.contactText}>
              {invoice.companySnapshot?.phone || business?.phone || "0748 333 555"}
            </Text>
            <Text style={styles.contactText}>
              {invoice.companySnapshot?.email || business?.email || "info@ruiruautogarage.com"}
            </Text>
            <Text style={styles.contactText}>
              PIN: {invoice.companySnapshot?.kraPin || business?.kraPin || "N/A"}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.invoiceTitleBlock}>
              <Text style={styles.invoiceTitleLarge}>{isPaid ? "RECEIPT" : "INVOICE"}</Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.metaLabel, { color: "rgba(255,255,255,0.9)", fontWeight: "bold", fontSize: 8, letterSpacing: 2 }]}>{isPaid ? "RECEIPT NO" : "INVOICE NO"}</Text>
                <Text style={[styles.metaValue, { fontSize: 11 }]}>{invoice.invoiceNumber}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* === CUSTOMER DETAILS === */}
        <View style={styles.customerSection}>
          <View style={[styles.customerCol, isPaid && { borderLeftColor: COLORS.success }]}>
            <Text style={styles.sectionLabel}>Billed To</Text>
            <Text style={styles.clientName}>
              {invoice.clientId
                ? `${invoice.clientId.firstName} ${invoice.clientId.lastName}`
                : invoice.clientSnapshot?.name || "Walk-In Client"}
            </Text>
            <Text style={styles.clientDetail}>
              {invoice.clientId?.email || invoice.clientSnapshot?.email}
            </Text>
            <Text style={styles.clientDetail}>
              {invoice.clientId?.phone || invoice.clientSnapshot?.phone}
            </Text>
            <Text style={styles.clientDetail}>
              PIN: {invoice.clientId?.kraPin || invoice.clientSnapshot?.kraPin || "N/A"}
            </Text>
          </View>

          <View style={styles.customerCol}>
            <Text style={styles.sectionLabel}>Vehicle Details</Text>
            {(() => {
              const displayVehicles = invoice.vehicles && invoice.vehicles.length > 0
                ? invoice.vehicles
                : (invoice.vehicle ? [invoice.vehicle] : []);

              if (displayVehicles.length === 0) {
                return (
                  <Text style={[styles.clientDetail, { fontStyle: "italic", color: COLORS.gray }]}>
                    No vehicle specified
                  </Text>
                );
              }

              return displayVehicles.map((v, idx) => {
                const currentVehicle = invoice.clientId?.vehicles?.find(
                  cv => cv.registration === v.registration
                );
                const displayV = currentVehicle || v;
                return (
                  <View key={idx} style={{ 
                    marginTop: idx > 0 ? 5 : 0, 
                    paddingTop: idx > 0 ? 4 : 0, 
                    borderTopWidth: idx > 0 ? 0.5 : 0, 
                    borderTopColor: "#E5E7EB" 
                  }}>
                    <Text style={[styles.clientName, { fontSize: 10, marginBottom: 1 }]}>
                      {displayV.make} {displayV.model} {displayV.year ? `(${displayV.year})` : ""}
                    </Text>
                    <Text style={styles.clientDetail}>
                      REG: {displayV.registration}
                    </Text>
                    {displayV.color && (
                      <Text style={styles.clientDetail}>
                        Color: {displayV.color}
                      </Text>
                    )}
                    {displayV.vin && (
                      <Text style={styles.clientDetail}>
                        VIN: {displayV.vin}
                      </Text>
                    )}
                  </View>
                );
              });
            })()}
          </View>
        </View>

        {/* === TABLE === */}
        <View style={styles.tableContainer}>
          <Text style={{ fontSize: 10, fontWeight: "bold", color: COLORS.dark, marginBottom: 8 }}>SERVICE DETAILS</Text>
          {/* Header */}
          <View style={styles.tableHeader} wrap={false}>
            {/* Background SVG */}
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
              <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <Path d="M0,0 L55.5,0 L51.5,100 L0,100 Z" fill={COLORS.dark} />
                <Path d="M56,0 L100,0 L100,100 L52,100 Z" fill={COLORS.primary} />
              </Svg>
            </View>

            <Text style={[styles.th, styles.col1]}>No</Text>
            <Text style={[styles.th, styles.col2]}>Service Description</Text>
            <Text style={[styles.th, styles.col3]}>Qty</Text>
            <Text style={[styles.th, styles.col4]}>Unit Price</Text>
            <Text style={[styles.th, styles.col5, { textAlign: "right", paddingRight: 10 }]}>
              Total Price
            </Text>
          </View>

          {/* Rows */}
          {invoice.items?.map((item, idx) => (
            <View
              key={idx}
              wrap={false}
              style={[
                styles.tableRow,
                { backgroundColor: idx % 2 !== 0 ? "#FAFAFA" : "white" },
              ]}
            >
              <Text style={[styles.td, styles.col1]}>{idx + 1}</Text>
              <Text style={[styles.td, styles.col2]}>{item.description}</Text>
              <Text style={[styles.td, styles.col3]}>{item.quantity}</Text>
              <Text style={[styles.td, styles.col4]}>{item.unitPrice?.toLocaleString()}</Text>
              <Text style={[styles.td, styles.col5, { fontWeight: "bold" }]}>
                {(item.quantity * item.unitPrice)?.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* === FINANCIALS === */}
        <View style={styles.financialsContainer} wrap={false}>
          <View style={styles.financialsBox}>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Subtotal</Text>
              <Text style={styles.financialValue}>
                KES {subTotal.toLocaleString()}
              </Text>
            </View>

            {laborCharge > 0 && (
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Labor Charge</Text>
                <Text style={styles.financialValue}>
                  KES {laborCharge.toLocaleString()}
                </Text>
              </View>
            )}

            {discount > 0 && (
              <View style={styles.financialRow}>
                <Text
                  style={[styles.financialLabel, { color: COLORS.primary }]}
                >
                  Discount
                </Text>
                <Text
                  style={[styles.financialValue, { color: COLORS.primary }]}
                >
                  - KES {discount.toLocaleString()}
                </Text>
              </View>
            )}

            {taxAmount > 0 && (
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>VAT (16%)</Text>
                <Text style={styles.financialValue}>
                  KES {taxAmount.toLocaleString()}
                </Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
                <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <Path d="M0,0 L64.5,0 L59.5,100 L0,100 Z" fill={COLORS.dark} />
                  <Path d="M65,0 L100,0 L100,100 L60,100 Z" fill={isPaid ? COLORS.success : COLORS.primary} />
                </Svg>
              </View>
              <Text style={[styles.totalLabel, { width: "65%", paddingLeft: 15 }]}>{isPaid ? "Total Paid" : "Total Due (KES)"}</Text>
              <Text style={[styles.totalValue, { width: "35%", textAlign: "center" }]}>
                {totalAmount.toLocaleString()}
              </Text>
            </View>

            {isPaid && (
              <View style={[styles.totalRow, { marginTop: 2 }]}>
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
                  <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <Path d="M0,0 L64.5,0 L59.5,100 L0,100 Z" fill={COLORS.primary} />
                    <Path d="M65,0 L100,0 L100,100 L60,100 Z" fill={COLORS.dark} />
                  </Svg>
                </View>
                <Text style={[styles.totalLabel, { width: "65%", paddingLeft: 15 }]}>Balance Due</Text>
                <Text style={[styles.totalValue, { width: "35%", textAlign: "center" }]}>KES 0</Text>
              </View>
            )}
          </View>
        </View>

        {/* === NOTES & PAYMENT INFO === */}
        <View style={styles.notesContainer} wrap={false}>
          {isPaid ? (
             <>
               <Text style={[styles.notesTitle, { color: COLORS.success }]}>PAYMENT RECEIVED</Text>
               <Text style={styles.notesText}>Thank you for your business! Your payment has been received in full.</Text>
             </>
          ) : (
            <>
              <Text style={styles.notesTitle}>PAYMENT INSTRUCTIONS</Text>
              <Text style={styles.notesText}>
                Payment is due immediately upon receipt.
              </Text>
              {invoice.companySnapshot?.bankDetails?.bankName ? (
                <>
                  <Text style={styles.notesText}>Bank: {invoice.companySnapshot.bankDetails.bankName} - {invoice.companySnapshot.bankDetails.branch}</Text>
                  <Text style={styles.notesText}>Account Name: {invoice.companySnapshot.bankDetails.accountName}</Text>
                  <Text style={styles.notesText}>Account No: {invoice.companySnapshot.bankDetails.accountNumber}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.notesText}>Payment Method: M-PESA</Text>
                  <Text style={styles.notesText}>Till Number: 6691993</Text>
                  <Text style={styles.notesText}>
                    Paybill: 880100 | Account: 114180
                  </Text>
                </>
              )}
            </>
          )}
        </View>

        {/* === FOOTER === */}
        <View style={styles.footerSection}>
          <View style={{ height: 25, flexDirection: "row", position: "relative", overflow: "hidden" }}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
              <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <Path d="M0,0 L49.5,0 L54.5,100 L0,100 Z" fill={isPaid ? COLORS.success : COLORS.primary} />
                <Path d="M50,0 L100,0 L100,100 L55,100 Z" fill={COLORS.dark} />
              </Svg>
            </View>
            <View style={{ width: "50%", padding: 5, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: COLORS.white, fontSize: 7, textTransform: "uppercase" }}>
                {invoice.companySnapshot?.address?.city 
                  ? `${invoice.companySnapshot.address.street || ''}, ${invoice.companySnapshot.address.city}` 
                  : "RUIRU TOWN, ALONG MATHIGU ROAD"}
              </Text>
            </View>
            <View style={{ width: "50%", padding: 5, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: COLORS.white, fontSize: 8, textTransform: "uppercase" }}>
                WWW.RUIRUAUTOGARAGE.COM
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* === POST SERVICE REPORT === */}
      {invoice.showPostServiceReport && invoice.postServiceReport && (
        <Page size="A4" style={styles.reportPage}>
          <View style={styles.reportHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
              <Image src={invoice.companySnapshot?.logo || logo} style={styles.logo} />
              <View>
                <Text style={styles.slogan}>{invoice.companySnapshot?.name || "Ruiru Auto Garage"}</Text>
                <Text style={styles.notesText}>{invoice.companySnapshot?.phone || business?.phone}</Text>
                <Text style={styles.notesText}>{invoice.companySnapshot?.email || business?.email}</Text>
              </View>
            </View>
            <Text style={styles.reportSubtitle}>EXECUTIVE SUMMARY</Text>
          </View>

          <Text style={styles.reportTitle}>Post-Service Findings & Recommendations</Text>
          <View style={{ ...styles.invoiceMetadata, marginTop: 0, marginBottom: 15 }}>
            {invoice.vehicle?.registration && (
              <View style={{ alignItems: "flex-start" }}>
                <Text style={styles.reportMetaLabel}>Vehicle Reg</Text>
                <Text style={styles.reportMetaValue}>{invoice.vehicle.registration}</Text>
              </View>
            )}
            <View style={{ alignItems: "flex-start" }}>
              <Text style={styles.reportMetaLabel}>Client</Text>
              <Text style={styles.reportMetaValue}>{invoice.clientSnapshot?.name}</Text>
            </View>
            <View style={{ alignItems: "flex-start" }}>
              <Text style={styles.reportMetaLabel}>Invoice Ref</Text>
              <Text style={styles.reportMetaValue}>{invoice.invoiceNumber}</Text>
            </View>
            <View style={{ alignItems: "flex-start" }}>
              <Text style={styles.reportMetaLabel}>Date</Text>
              <Text style={styles.reportMetaValue}>{format(new Date(), "MMM dd, yyyy")}</Text>
            </View>
          </View>

          {invoice.postServiceReport.keyObservation && (
            <View>
              <Text style={styles.reportSectionTitle}>1. Key Observation</Text>
              <Text style={styles.reportText}>{invoice.postServiceReport.keyObservation}</Text>
            </View>
          )}

          {invoice.postServiceReport.partsQuotation && invoice.postServiceReport.partsQuotation.length > 0 && (
            <View style={{ marginTop: 15 }}>
              <Text style={styles.reportSectionTitle}>2. Replacement Parts Quotation</Text>
              
              <View style={[styles.tableContainer, { marginHorizontal: 0 }]}>
                {/* Header */}
                <View style={styles.tableHeader}>
                  <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
                    <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <Path d="M0,0 L100,0 L100,100 L0,100 Z" fill={COLORS.dark} />
                    </Svg>
                  </View>
                  <Text style={[styles.th, styles.col1]}>No</Text>
                  <Text style={[styles.th, styles.col2]}>Item Description</Text>
                  <Text style={[styles.th, styles.col3]}>Qty</Text>
                  <Text style={[styles.th, styles.col4]}>Unit Price</Text>
                  <Text style={[styles.th, styles.col5, { textAlign: "right", paddingRight: 10 }]}>Total Price</Text>
                </View>

                {/* Rows */}
                {invoice.postServiceReport.partsQuotation.map((part, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      { backgroundColor: index % 2 !== 0 ? "#FAFAFA" : "white" },
                    ]}
                  >
                    <Text style={[styles.td, styles.col1]}>{index + 1}</Text>
                    <Text style={[styles.td, styles.col2]}>{part.description}</Text>
                    <Text style={[styles.td, styles.col3]}>{part.quantity}</Text>
                    <Text style={[styles.td, styles.col4]}>{part.unitPrice?.toLocaleString()}</Text>
                    <Text style={[styles.td, styles.col5, { fontWeight: "bold" }]}>{part.amount?.toLocaleString()}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.totalRow}>
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
                  <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <Path d="M0,0 L100,0 L100,100 L0,100 Z" fill={COLORS.dark} />
                  </Svg>
                </View>
                <Text style={[styles.totalLabel, { width: "65%", paddingLeft: 15 }]}>ESTIMATED COST</Text>
                <Text style={[styles.totalValue, { width: "35%", textAlign: "center" }]}>KES {invoice.postServiceReport.partsQuotation.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}</Text>
              </View>
            </View>
          )}

          {invoice.postServiceReport.costImplication && (
            <View>
              <Text style={styles.reportSectionTitle}>3. Cost Implication of Neglect</Text>
              <Text style={styles.reportText}>{invoice.postServiceReport.costImplication}</Text>
            </View>
          )}

          {invoice.postServiceReport.recommendations && invoice.postServiceReport.recommendations.length > 0 && (
            <View>
              <Text style={styles.reportSectionTitle}>4. Recommendations</Text>
              {invoice.postServiceReport.recommendations.map((rec, idx) => (
                <Text key={idx} style={styles.reportText}>{idx + 1}. {rec}</Text>
              ))}
            </View>
          )}

          {invoice.postServiceReport.conclusion && (
            <View>
              <Text style={styles.reportSectionTitle}>5. Conclusion</Text>
              <Text style={styles.reportText}>{invoice.postServiceReport.conclusion}</Text>
            </View>
          )}

          {invoice.postServiceReport.images && invoice.postServiceReport.images.length > 0 && (
            <View wrap={false} style={{ marginTop: 20 }}>
              <Text style={styles.reportSectionTitle}>Evidence & Findings</Text>
              <View style={styles.reportImagesContainer}>
                {invoice.postServiceReport.images.map((img, idx) => (
                  <Image key={idx} src={img} style={styles.reportImage} />
                ))}
              </View>
            </View>
          )}
        </Page>
      )}
    </Document>
  );
};

export default InvoicePDF;
