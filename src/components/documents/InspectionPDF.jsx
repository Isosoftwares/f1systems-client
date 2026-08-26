import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from "@react-pdf/renderer";
import { format } from "date-fns";
import logo from "../../assets/graphics/garagelogo.jpeg";

const COLORS = {
  primary: "#D30000",
  dark: "#1A1A1A",
  text: "#333333",
  gray: "#666666",
  lightGray: "#F3F4F6",
  white: "#FFFFFF",
  success: "#10b981",
  warning: "#FFC107",
  danger: "#D30000",
};

const styles = StyleSheet.create({
  page: { paddingBottom: 60, backgroundColor: COLORS.white, fontFamily: "Helvetica", fontSize: 10 },
  headerContainer: { flexDirection: "row", height: 140, marginBottom: 20 },
  headerLeft: { width: "50%", paddingTop: 30, paddingLeft: 40, justifyContent: "center" },
  logo: { width: 60, height: 60, borderRadius: 30, marginBottom: 10, objectFit: "contain" },
  companyInfo: { marginTop: 5 },
  slogan: { color: COLORS.white, fontSize: 10, fontWeight: "bold", textTransform: "uppercase", marginBottom: 4, letterSpacing: 2 },
  contactText: { fontSize: 9, color: "rgba(255,255,255,0.8)", marginBottom: 2 },
  headerRight: { width: "50%", height: "100%", position: "relative" },
  invoiceTitleBlock: { position: "absolute", top: 40, right: 40, alignItems: "flex-end" },
  invoiceTitleLarge: { fontSize: 24, fontWeight: "heavy", color: COLORS.white, letterSpacing: 2, marginBottom: 6 },
  metaLabel: { color: "rgba(255,255,255,0.9)", fontSize: 8, textTransform: "uppercase", letterSpacing: 2 },
  metaValue: { color: COLORS.white, fontSize: 11, fontWeight: "bold" },
  
  contentContainer: { paddingHorizontal: 40 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 11, fontWeight: "bold", color: COLORS.dark, borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: 5, marginBottom: 8, textTransform: "uppercase" },
  
  infoGrid: { flexDirection: "row", gap: 20, marginBottom: 15 },
  infoCol: { flex: 1, backgroundColor: COLORS.lightGray, padding: 10, borderRadius: 4, borderLeft: `3px solid ${COLORS.primary}` },
  infoLabel: { fontSize: 7, color: COLORS.gray, textTransform: "uppercase", fontWeight: "bold", marginBottom: 4 },
  infoValue: { fontSize: 10, color: COLORS.dark, fontWeight: "bold" },
  infoSub: { fontSize: 8, color: COLORS.text, marginTop: 2 },

  table: { width: "100%", border: `1px solid ${COLORS.lightGray}`, borderRadius: 4, overflow: "hidden" },
  tableRow: { flexDirection: "row", borderBottom: `1px solid ${COLORS.lightGray}` },
  photoSection: {
    marginTop: 15,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  photoImage: {
    width: 150,
    height: 100,
    objectFit: 'cover',
    borderRadius: 4,
    border: `1px solid ${COLORS.lightGray}`,
  },
  tableHeader: { backgroundColor: COLORS.dark, padding: 8 },
  th: { color: COLORS.white, fontSize: 8, fontWeight: "bold", textTransform: "uppercase" },
  tdArea: { width: "30%", padding: 8, backgroundColor: "#F9FAFB", fontSize: 9, fontWeight: "bold", color: COLORS.dark },
  tdRating: { width: "20%", padding: 8, fontSize: 9, fontWeight: "bold" },
  tdNotes: { width: "50%", padding: 8, fontSize: 8, color: COLORS.text, fontStyle: "italic" },

  verdictBox: { backgroundColor: "#FFF5F5", padding: 15, borderRadius: 6, border: `1px solid #FED7D7`, marginTop: 10 },
  verdictTitle: { fontSize: 12, fontWeight: "bold", color: COLORS.primary, marginBottom: 8 },
  verdictRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },

  footerSection: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

const getRatingColor = (rating) => {
  if (rating === "Excellent" || rating === "Good") return COLORS.success;
  if (rating === "Fair") return COLORS.warning;
  if (rating === "Poor") return COLORS.danger;
  return COLORS.gray;
};

const InspectionPDF = ({ inspection, business }) => {
  const company = {
    name: inspection.companySnapshot?.name || business?.name || "Ruiru Auto Garage",
    phone: inspection.companySnapshot?.phone || business?.phone || "0748 333 555",
    email: inspection.companySnapshot?.email || business?.email || "info@ruiruautogarage.com",
    address: inspection.companySnapshot?.address || business?.address || { city: "RUIRU TOWN, ALONG MATHIGU ROAD" },
    kraPin: inspection.companySnapshot?.kraPin || business?.kraPin || "N/A",
    logo: inspection.companySnapshot?.logo || business?.logo || logo,
    website: inspection.companySnapshot?.website || business?.website || "WWW.RUIRUAUTOGARAGE.COM"
  };

  const sections = [
    { name: "Exterior & Bodywork", key: "exterior" },
    { name: "Interior & Cabin", key: "interior" },
    { name: "Engine & Under Hood", key: "engineAndUnderHood" },
    { name: "Suspension & Steering", key: "suspensionAndSteering" },
    { name: "Brakes & Tires", key: "brakesAndTires" },
    { name: "Electronics & AC", key: "electronics" },
    { name: "Road Test", key: "roadTest" },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* === HEADER BACKGROUND === */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 140 }}>
          <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Path d="M0,0 L100,0 L100,100 L0,100 Z" fill={COLORS.white} />
            <Path d="M40,0 L100,0 L100,100 L55,100 Z" fill={COLORS.primary} />
            <Path d="M0,0 L39.5,0 L54.5,100 L0,100 Z" fill={COLORS.dark} />
          </Svg>
        </View>

        {/* === HEADER CONTENT === */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image src={company.logo} style={styles.logo} />
            <Text style={styles.slogan}>{company.name}</Text>
            <Text style={styles.contactText}>{company.phone}</Text>
            <Text style={styles.contactText}>{company.email}</Text>
            <Text style={styles.contactText}>PIN: {company.kraPin}</Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.invoiceTitleBlock}>
              <Text style={styles.invoiceTitleLarge}>INSPECTION</Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.metaLabel, { marginBottom: 2 }]}>REF NO</Text>
                <Text style={[styles.metaValue, { marginBottom: 6 }]}>{inspection.reportId}</Text>
                <Text style={[styles.metaLabel, { marginBottom: 2 }]}>DATE</Text>
                <Text style={styles.metaValue}>{format(new Date(inspection.createdAt || inspection.inspectionDate || new Date()), "MMM dd, yyyy")}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Client Details</Text>
              <Text style={styles.infoValue}>
                {inspection.clientId ? `${inspection.clientId.firstName} ${inspection.clientId.lastName}` : inspection.clientSnapshot?.name}
              </Text>
              <Text style={styles.infoSub}>{inspection.clientId?.phone || inspection.clientSnapshot?.phone}</Text>
              {(inspection.clientId?.kraPin || inspection.clientSnapshot?.kraPin) && (
                <Text style={styles.infoSub}>PIN: {inspection.clientId?.kraPin || inspection.clientSnapshot?.kraPin}</Text>
              )}
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Vehicle Details</Text>
              <Text style={styles.infoValue}>
                {inspection.vehicleId?.make || inspection.vehicleSnapshot?.make || ""} {inspection.vehicleId?.model || inspection.vehicleSnapshot?.model || "N/A"} {(inspection.vehicleId?.year || inspection.vehicleSnapshot?.year) ? `(${inspection.vehicleId?.year || inspection.vehicleSnapshot?.year})` : ""}
              </Text>
              <Text style={styles.infoSub}>Reg: {inspection.vehicleId?.registration || inspection.vehicleSnapshot?.registration}</Text>
              <Text style={styles.infoSub}>Mileage: {inspection.vehicleId?.mileage || inspection.vehicleSnapshot?.mileage || "N/A"}</Text>
              {(inspection.vehicleId?.color || inspection.vehicleSnapshot?.color) && (
                <Text style={styles.infoSub}>Color: {inspection.vehicleId?.color || inspection.vehicleSnapshot?.color}</Text>
              )}
              {(inspection.vehicleId?.vin || inspection.vehicleSnapshot?.vin) && (
                <Text style={styles.infoSub}>VIN: {inspection.vehicleId?.vin || inspection.vehicleSnapshot?.vin}</Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inspection Points</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.th, { width: "30%", paddingLeft: 8 }]}>Area</Text>
                <Text style={[styles.th, { width: "20%", paddingLeft: 8 }]}>Condition</Text>
                <Text style={[styles.th, { width: "50%", paddingLeft: 8 }]}>Remarks</Text>
              </View>
              {sections.map((sec, idx) => (
                <View key={idx} style={[styles.tableRow, idx === sections.length - 1 && { borderBottom: "none" }]}>
                  <Text style={styles.tdArea}>{sec.name}</Text>
                  <Text style={[styles.tdRating, { color: getRatingColor(inspection[sec.key]?.rating) }]}>
                    {inspection[sec.key]?.rating || "N/A"}
                  </Text>
                  <Text style={styles.tdNotes}>{inspection[sec.key]?.notes || "-"}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.verdictBox}>
            <Text style={styles.verdictTitle}>FINAL VERDICT & RECOMMENDATION</Text>
            <View style={styles.verdictRow}>
              <Text style={{ fontSize: 9, color: COLORS.dark }}>Overall Recommendation:</Text>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: getRatingColor(inspection.overallRecommendation === "Requires Repairs" || inspection.overallRecommendation === "Not Recommended" ? "Poor" : "Excellent") }}>
                {inspection.overallRecommendation.toUpperCase()}
              </Text>
            </View>
            <View style={styles.verdictRow}>
              <Text style={{ fontSize: 9, color: COLORS.dark }}>Estimated Repair Cost:</Text>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: COLORS.dark }}>
                KES {inspection.estimatedRepairCost?.toLocaleString() || 0}
              </Text>
            </View>
            {inspection.finalRemarks && (
              <View style={{ marginTop: 8, borderTop: `1px solid #FED7D7`, paddingTop: 8 }}>
                <Text style={{ fontSize: 9, color: COLORS.dark, fontStyle: "italic" }}>"{inspection.finalRemarks}"</Text>
              </View>
            )}
            <View style={{ marginTop: 8, borderTop: `1px solid #FED7D7`, paddingTop: 8 }}>
              <Text style={{ fontSize: 8, color: COLORS.gray }}>Inspected By: <Text style={{ color: COLORS.dark, fontWeight: "bold" }}>{inspection.inspectorName}</Text></Text>
            </View>
          </View>

          {inspection.photos && inspection.photos.length > 0 && (
            <View style={styles.photoSection} break>
              <Text style={styles.sectionTitle}>Inspection Photos</Text>
              <View style={styles.photoGrid}>
                {inspection.photos.map((photo, index) => (
                  <Image key={index} src={photo} style={styles.photoImage} />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* === FOOTER === */}
        <View style={styles.footerSection}>
          <View style={{ height: 25, flexDirection: "row", position: "relative", overflow: "hidden" }}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
              <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <Path d="M0,0 L49.5,0 L54.5,100 L0,100 Z" fill={COLORS.primary} />
                <Path d="M50,0 L100,0 L100,100 L55,100 Z" fill={COLORS.dark} />
              </Svg>
            </View>
            <View style={{ width: "50%", padding: 5, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: COLORS.white, fontSize: 7, textTransform: "uppercase" }}>
                {typeof company.address === 'object' 
                  ? `${company.address.street || ''}${company.address.street && company.address.city ? ', ' : ''}${company.address.city || ''}`
                  : company.address}
              </Text>
            </View>
            <View style={{ width: "50%", padding: 5, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: COLORS.white, fontSize: 8, textTransform: "uppercase" }}>
                {company.website}
              </Text>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default InspectionPDF;
