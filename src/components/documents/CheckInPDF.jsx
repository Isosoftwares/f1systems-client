import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from "@react-pdf/renderer";
import { format } from "date-fns";

const COLORS = {
  primary: "#D30000", // Bright Red
  dark: "#1A1A1A", // Deep Black
  text: "#333333", // Dark Gray text
  gray: "#666666",
  lightGray: "#F3F4F6",
  white: "#FFFFFF",
  accent: "#FFC107", // Gold/Yellow
  headerBg: "#F9FAFB",
  success: "#10b981",
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
  invoiceTitleLarge: { fontSize: 26, fontWeight: "heavy", color: COLORS.white, letterSpacing: 2, marginBottom: 6 },
  metaLabel: { color: "rgba(255,255,255,0.9)", fontSize: 8, textTransform: "uppercase", letterSpacing: 2 },
  metaValue: { color: COLORS.white, fontSize: 11, fontWeight: "bold" },
  
  contentContainer: { paddingHorizontal: 40 },
  section: { marginBottom: 20 },
  footerSection: { position: "absolute", bottom: 0, left: 0, right: 0 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: COLORS.dark, borderBottom: `1px solid ${COLORS.light}`, paddingBottom: 5, marginBottom: 10, textTransform: "uppercase" },
  gridRow: { flexDirection: "row", gap: 20, marginBottom: 5 },
  gridCol: { flex: 1 },
  label: { fontSize: 8, color: COLORS.gray, textTransform: "uppercase", marginBottom: 2 },
  value: { fontSize: 10, color: COLORS.dark, fontWeight: "bold" },
  checklistItem: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  checklistLabel: { fontSize: 9, color: COLORS.dark, marginLeft: 5 },
  photosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 },
  photo: { width: "31%", height: 120, objectFit: "cover", borderRadius: 4 },
  signatureSection: { marginTop: 40, flexDirection: "row", gap: 40 },
  signatureBox: { flex: 1 },
  signatureImage: { width: 150, height: 60, objectFit: "contain", marginBottom: 5 },
  signatureLine: { borderTop: `1px solid ${COLORS.gray}`, paddingTop: 5, marginTop: 30 },
  disclaimer: { fontSize: 7, color: COLORS.gray, marginTop: 15, fontStyle: "italic", textAlign: "center" }
});

const CheckInPDF = ({ checkIn }) => {
  const company = checkIn.companySnapshot || { name: "Ruiru Auto Garage", phone: "+254 700 000000", email: "info@ruiruautogarage.com" };

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
            {company.logo && <Image src={company.logo} style={styles.logo} />}
            <Text style={styles.slogan}>{company.name}</Text>
            <Text style={styles.contactText}>{company.phone}</Text>
            <Text style={styles.contactText}>{company.email}</Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.invoiceTitleBlock}>
              <Text style={styles.invoiceTitleLarge}>VEHICLE ARRIVAL</Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.metaLabel, { marginBottom: 2 }]}>REF NO</Text>
                <Text style={[styles.metaValue, { marginBottom: 6 }]}>{checkIn.reportId}</Text>
                <Text style={[styles.metaLabel, { marginBottom: 2 }]}>DATE</Text>
                <Text style={styles.metaValue}>{format(new Date(checkIn.checkInDate), "MMM dd, yyyy")}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
        {/* Client & Vehicle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client & Vehicle Details</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Client Name</Text>
              <Text style={styles.value}>{checkIn.clientId?.firstName} {checkIn.clientId?.lastName}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Client Phone</Text>
              <Text style={styles.value}>{checkIn.clientId?.phone}</Text>
            </View>
          </View>
          <View style={[styles.gridRow, { marginTop: 10 }]}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Vehicle Reg</Text>
              <Text style={styles.value}>{checkIn.vehicleId?.registration}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Vehicle Make & Model</Text>
              <Text style={styles.value}>{checkIn.vehicleId?.make || ""} {checkIn.vehicleId?.model || "N/A"} {checkIn.vehicleId?.year ? `(${checkIn.vehicleId.year})` : ""}</Text>
            </View>
            {checkIn.vehicleId?.color && (
              <View style={styles.gridCol}>
                <Text style={styles.label}>Color</Text>
                <Text style={styles.value}>{checkIn.vehicleId.color}</Text>
              </View>
            )}
            {checkIn.vehicleId?.vin && (
              <View style={styles.gridCol}>
                <Text style={styles.label}>VIN</Text>
                <Text style={styles.value}>{checkIn.vehicleId.vin}</Text>
              </View>
            )}
            <View style={styles.gridCol}>
              <Text style={styles.label}>Mileage In</Text>
              <Text style={styles.value}>{checkIn.mileageIn} KM</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Fuel Level</Text>
              <Text style={styles.value}>{checkIn.fuelLevel}</Text>
            </View>
          </View>
        </View>

        {/* Valuables */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valuables & Accessories</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {Object.entries(checkIn.valuablesAndAccessories || {}).map(([key, value]) => {
              if (key === 'other') return null;
              return (
                <View key={key} style={[styles.checklistItem, { width: "33%" }]}>
                  <Text style={{ color: value ? COLORS.success : COLORS.danger, fontWeight: "bold" }}>{value ? "✓" : "✗"}</Text>
                  <Text style={styles.checklistLabel}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
                </View>
              )
            })}
          </View>
          {checkIn.valuablesAndAccessories?.other && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>Other Items</Text>
              <Text style={styles.value}>{checkIn.valuablesAndAccessories.other}</Text>
            </View>
          )}
        </View>

        {/* Exterior */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exterior Condition (Reported Damages)</Text>
          {checkIn.exteriorCondition && checkIn.exteriorCondition.length > 0 ? (
            checkIn.exteriorCondition.map((dmg, idx) => (
              <Text key={idx} style={{ fontSize: 9, color: COLORS.dark, marginBottom: 3 }}>
                • {dmg.part}: {dmg.damageType}
              </Text>
            ))
          ) : (
            <Text style={{ fontSize: 9, color: COLORS.gray }}>No pre-existing damages reported.</Text>
          )}
        </View>

        {/* Photos */}
        {checkIn.photos && checkIn.photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Check-In Photos</Text>
            <View style={styles.photosGrid}>
              {checkIn.photos.slice(0, 6).map((photo, idx) => (
                <Image key={idx} src={photo} style={styles.photo} />
              ))}
            </View>
          </View>
        )}

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.label}>Attendant Name</Text>
            <Text style={[styles.value, { marginTop: 10 }]}>{checkIn.attendantName}</Text>
            <View style={styles.signatureLine}>
              <Text style={{ fontSize: 8, color: COLORS.gray }}>Garage Representative</Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.label}>Client Signature</Text>
            {checkIn.clientSignature && <Image src={checkIn.clientSignature} style={styles.signatureImage} />}
            <View style={[styles.signatureLine, { marginTop: checkIn.clientSignature ? 0 : 30 }]}>
              <Text style={{ fontSize: 8, color: COLORS.gray }}>Client Sign-off</Text>
            </View>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          "I confirm that the above items and vehicle condition have been recorded accurately upon drop-off."
        </Text>
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
                {company.address?.city 
                  ? `${company.address.street || ''}, ${company.address.city}` 
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
    </Document>
  );
};

export default CheckInPDF;
