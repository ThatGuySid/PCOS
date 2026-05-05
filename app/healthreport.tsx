import TrackerListItem from "@/components/health/TrackerListItem";
import TrackerPill from "@/components/health/TrackerPill";
import TrackerSection from "@/components/health/TrackerSection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Image,
    ImageBackground,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { WebView } from "react-native-webview";

type ReportCategory = "Blood Tests" | "Scans" | "Prescriptions";

type VaultReport = {
  id: string;
  title: string;
  category: ReportCategory;
  sourceName: string;
  reportDate: string;
  fileName: string;
  uri: string;
  mimeType: string;
  sizeBytes: number;
};

const REPORT_FILTERS: ("All" | ReportCategory)[] = [
  "All",
  "Blood Tests",
  "Scans",
  "Prescriptions",
];

const VAULT_STORAGE_KEY = "pcos.health.vault.reports.v1";

function toSafeString(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim().length > 0) return value;
  return fallback;
}

function sanitizeReport(raw: unknown): VaultReport | null {
  if (!raw || typeof raw !== "object") return null;

  const candidate = raw as Partial<VaultReport>;
  const category: ReportCategory =
    candidate.category === "Blood Tests" ||
    candidate.category === "Scans" ||
    candidate.category === "Prescriptions"
      ? candidate.category
      : "Scans";

  const safeSize =
    typeof candidate.sizeBytes === "number" &&
    Number.isFinite(candidate.sizeBytes)
      ? Math.max(0, candidate.sizeBytes)
      : 0;

  return {
    id: toSafeString(
      candidate.id,
      `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    ),
    title: toSafeString(candidate.title, "Untitled Report"),
    category,
    sourceName: toSafeString(candidate.sourceName, "Unknown Source"),
    reportDate: toSafeString(candidate.reportDate, "Unknown Date"),
    fileName: toSafeString(candidate.fileName, "report"),
    uri: toSafeString(candidate.uri, ""),
    mimeType: toSafeString(candidate.mimeType, "application/octet-stream"),
    sizeBytes: safeSize,
  };
}

function isVaultReport(entry: VaultReport | null): entry is VaultReport {
  return entry !== null;
}

function formatBytes(sizeBytes: number) {
  if (sizeBytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(sizeBytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = sizeBytes / 1024 ** index;
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function getReportVisuals(report: VaultReport) {
  if (report.category === "Scans") {
    return { icon: "🖼️", iconBg: "#FFF2E0", accent: "#F97316" };
  }

  if (report.category === "Prescriptions") {
    return { icon: "💊", iconBg: "#EFE7FF", accent: "#7C3AED" };
  }

  return { icon: "📄", iconBg: "#FDE8EC", accent: "#E84D73" };
}

function isPdf(report: VaultReport) {
  return (
    report.mimeType.includes("pdf") ||
    report.fileName.toLowerCase().endsWith(".pdf")
  );
}

function isImage(report: VaultReport) {
  return report.mimeType.startsWith("image/");
}

export default function HealthReportVaultScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"All" | ReportCategory>(
    "All",
  );
  const [reports, setReports] = useState<VaultReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<VaultReport | null>(
    null,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const savedReports = await AsyncStorage.getItem(VAULT_STORAGE_KEY);
        if (!savedReports) {
          setIsHydrated(true);
          return;
        }

        const parsed = JSON.parse(savedReports) as unknown;
        const normalizedReports = Array.isArray(parsed)
          ? parsed
              .map((entry) => sanitizeReport(entry))
              .filter(isVaultReport)
              .filter((entry) => Boolean(entry.uri))
          : [];

        setReports(normalizedReports);
      } catch {
        Alert.alert("Vault", "Could not load saved reports.");
      } finally {
        setIsHydrated(true);
      }
    };

    void loadReports();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const persistReports = async () => {
      try {
        const normalizedReports = reports
          .map((entry) => sanitizeReport(entry))
          .filter(isVaultReport)
          .filter((entry) => Boolean(entry.uri));

        await AsyncStorage.setItem(
          VAULT_STORAGE_KEY,
          JSON.stringify(normalizedReports),
        );
      } catch {}
    };

    void persistReports();
  }, [isHydrated, reports]);

  const filteredReports = useMemo(() => {
    if (activeFilter === "All") return reports;
    return reports.filter((report) => report.category === activeFilter);
  }, [activeFilter, reports]);

  const totalStorageBytes = useMemo(
    () => reports.reduce((sum, report) => sum + report.sizeBytes, 0),
    [reports],
  );

  const storagePercent = Math.min(
    (totalStorageBytes / 1_000_000_000) * 100,
    100,
  );

  const chooseCategory = () =>
    new Promise<ReportCategory | null>((resolve) => {
      Alert.alert("Report Category", "Select a category for this report", [
        { text: "Blood Tests", onPress: () => resolve("Blood Tests") },
        { text: "Scans", onPress: () => resolve("Scans") },
        { text: "Prescriptions", onPress: () => resolve("Prescriptions") },
        { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
      ]);
    });

  const addReport = (
    file: {
      uri: string;
      name: string;
      mimeType?: string | null;
      size?: number | null;
    },
    sourceName: string,
    category: ReportCategory,
  ) => {
    const today = new Date();
    const reportDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const report: VaultReport = {
      id: `${today.getTime()}-${Math.random().toString(36).slice(2, 9)}`,
      title: file.name.replace(/\.[^/.]+$/, "") || "Untitled Report",
      category,
      sourceName,
      reportDate,
      fileName: file.name,
      uri: file.uri,
      mimeType: file.mimeType ?? "application/octet-stream",
      sizeBytes: file.size ?? 0,
    };

    setReports((currentReports) => [report, ...currentReports]);
    Alert.alert("Uploaded", "Report added to your health vault.");
  };

  const handleUploadFile = async () => {
    try {
      const category = await chooseCategory();
      if (!category) return;

      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const selectedFile = result.assets[0];
      addReport(
        {
          uri: selectedFile.uri,
          name: selectedFile.name,
          mimeType: selectedFile.mimeType,
          size: selectedFile.size,
        },
        "File Upload",
        category,
      );
    } catch {
      Alert.alert("Upload failed", "Could not upload the selected file.");
    }
  };

  const handleUploadGallery = async () => {
    try {
      const category = await chooseCategory();
      if (!category) return;

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Allow photo access to import scans.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) return;

      const image = result.assets[0];
      addReport(
        {
          uri: image.uri,
          name: image.fileName ?? `scan-${Date.now()}.jpg`,
          mimeType: image.mimeType,
          size: image.fileSize,
        },
        "Gallery Import",
        category,
      );
    } catch {
      Alert.alert("Upload failed", "Could not import image from gallery.");
    }
  };

  const handleDeleteReport = (reportId: string) => {
    Alert.alert(
      "Delete report",
      "This report will be removed from the vault.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setReports((currentReports) =>
              currentReports.filter((report) => report.id !== reportId),
            );
            setSelectedReport(null);
          },
        },
      ],
    );
  };

  const handleExportReport = async () => {
    if (!selectedReport) return;

    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert(
          "Export failed",
          "Sharing is not available on this device.",
        );
        return;
      }

      await Sharing.shareAsync(selectedReport.uri, {
        mimeType: selectedReport.mimeType,
        dialogTitle: "Export report",
      });

      Alert.alert(
        "Exported",
        "Use the share sheet to save or share this report.",
      );
    } catch {
      Alert.alert("Export failed", "Could not export this report.");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/onboarding backgroud.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1, backgroundColor: "rgba(254, 244, 245, 0.22)" }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 34 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{ paddingTop: 58, paddingHorizontal: 22, paddingBottom: 18 }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={{ marginBottom: 12 }}
            >
              <Text style={{ color: "#C0162C", fontSize: 16 }}>
                ← Health Report Vault
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "#3A0A12", fontSize: 28, fontWeight: "900" }}>
              Health Report Vault
            </Text>
            <Text style={{ color: "#9A6070", fontSize: 14, marginTop: 8 }}>
              Securely upload, sort, and retrieve your medical reports.
            </Text>
          </View>

          <View style={{ paddingHorizontal: 18 }}>
            <TrackerSection
              title="Vault Status"
              subtitle="Secure · Private "
              icon="🛡️"
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    borderRadius: 18,
                    paddingVertical: 22,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#F4D9DF",
                  }}
                >
                  <Text style={{ color: "#C0162C", fontSize: 30 }}>⇪</Text>
                  <Text
                    style={{
                      color: "#C0162C",
                      fontSize: 15,
                      fontWeight: "800",
                      marginTop: 8,
                    }}
                  >
                    Upload Report
                  </Text>
                  <Text
                    style={{ color: "#C88A96", fontSize: 12, marginTop: 4 }}
                  >
                    PDF · Image · Prescription
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                    <TrackerPill
                      label="Files"
                      active
                      onPress={handleUploadFile}
                    />
                    <TrackerPill
                      label="Gallery"
                      onPress={handleUploadGallery}
                    />
                  </View>
                </View>
              </View>
            </TrackerSection>

            <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
              {REPORT_FILTERS.map((filter) => (
                <TrackerPill
                  key={filter}
                  label={
                    filter === "All"
                      ? `All (${reports.length})`
                      : `${filter} (${reports.filter((report) => report.category === filter).length})`
                  }
                  active={filter === activeFilter}
                  onPress={() => setActiveFilter(filter)}
                />
              ))}
            </View>

            {filteredReports.length ? (
              filteredReports.map((report) => {
                const visuals = getReportVisuals(report);
                return (
                  <TrackerListItem
                    key={report.id}
                    icon={visuals.icon}
                    iconBg={visuals.iconBg}
                    title={report.title}
                    subtitle={`${report.sourceName} · ${report.reportDate}`}
                    meta={formatBytes(report.sizeBytes)}
                    accent={visuals.accent}
                    onPress={() => setSelectedReport(report)}
                  />
                );
              })
            ) : (
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#F4D9DF",
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{ color: "#3A0A12", fontSize: 14, fontWeight: "700" }}
                >
                  No reports yet
                </Text>
                <Text style={{ color: "#9A6070", fontSize: 12, marginTop: 4 }}>
                  Upload your first report from Files or Gallery.
                </Text>
              </View>
            )}

            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: "#F4D9DF",
                marginTop: 4,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{ color: "#3A0A12", fontSize: 14, fontWeight: "800" }}
                >
                  Storage Used
                </Text>
                <Text
                  style={{ color: "#C0162C", fontSize: 12, fontWeight: "700" }}
                >
                  🔒 Secure
                </Text>
              </View>
              <View
                style={{
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: "#F5E3E7",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${storagePercent}%`,
                    height: "100%",
                    backgroundColor: "#E84D73",
                    borderRadius: 999,
                  }}
                />
              </View>
              <Text style={{ color: "#9A6070", fontSize: 12, marginTop: 8 }}>
                {`${formatBytes(totalStorageBytes)} of 1 GB used`}
              </Text>
            </View>
          </View>
        </ScrollView>

        <Modal visible={!!selectedReport} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(58,10,18,0.72)",
              justifyContent: "center",
              padding: 14,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                overflow: "hidden",
                maxHeight: "92%",
              }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingTop: 14,
                  paddingBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F4D9DF",
                }}
              >
                <Text
                  style={{ color: "#3A0A12", fontSize: 17, fontWeight: "800" }}
                >
                  {selectedReport?.title}
                </Text>
                <Text style={{ color: "#9A6070", fontSize: 12, marginTop: 2 }}>
                  {selectedReport?.fileName}
                </Text>
              </View>

              <View style={{ height: 420, backgroundColor: "#FFF8FA" }}>
                {selectedReport && isImage(selectedReport) ? (
                  <Image
                    source={{ uri: selectedReport.uri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                ) : null}

                {selectedReport && isPdf(selectedReport) ? (
                  <WebView
                    source={{ uri: selectedReport.uri }}
                    style={{ flex: 1 }}
                  />
                ) : null}

                {selectedReport &&
                !isImage(selectedReport) &&
                !isPdf(selectedReport) ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 24,
                    }}
                  >
                    <Text
                      style={{
                        color: "#3A0A12",
                        fontSize: 14,
                        fontWeight: "700",
                      }}
                    >
                      Preview not available
                    </Text>
                    <Text
                      style={{
                        color: "#9A6070",
                        fontSize: 12,
                        marginTop: 6,
                        textAlign: "center",
                      }}
                    >
                      You can still export or share this report from the actions
                      below.
                    </Text>
                  </View>
                ) : null}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  padding: 14,
                  borderTopWidth: 1,
                  borderTopColor: "#F4D9DF",
                }}
              >
                <TouchableOpacity
                  onPress={handleExportReport}
                  activeOpacity={0.85}
                  style={{
                    flex: 1,
                    backgroundColor: "#C0162C",
                    borderRadius: 12,
                    paddingVertical: 11,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}
                  >
                    Save + Share
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    selectedReport && handleDeleteReport(selectedReport.id)
                  }
                  activeOpacity={0.85}
                  style={{
                    flex: 1,
                    backgroundColor: "#FDE8EC",
                    borderRadius: 12,
                    paddingVertical: 11,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#C0162C",
                      fontSize: 13,
                      fontWeight: "800",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedReport(null)}
                  activeOpacity={0.85}
                  style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#F0C4CC",
                    borderRadius: 12,
                    paddingVertical: 11,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#A14155",
                      fontSize: 13,
                      fontWeight: "800",
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}
