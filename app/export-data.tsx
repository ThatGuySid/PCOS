import { useUser } from "@/context/UserContext";
import { useAppStrings } from "@/hooks/useAppStrings";
import { getMedicineTracker } from "@/services/medicineService";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ExportDataScreen() {
  const router = useRouter();
  const { user, cycleSnapshot, recentSymptoms, firebaseUser } = useUser();
  const { strings } = useAppStrings();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const medicineTracker = firebaseUser
        ? await getMedicineTracker(firebaseUser.uid)
        : { medicines: [] };

      const payload = {
        exportedAt: new Date().toISOString(),
        exportVersion: 1,
        userProfile: user,
        cycleSnapshot,
        recentSymptoms,
        periodEntries: user.periodEntries,
        symptomLogs: user.symptomLogs,
        medicineTracker,
      };
      const json = JSON.stringify(payload, null, 2);

      if (!FileSystem.cacheDirectory) {
        Alert.alert(
          "Export failed",
          "File export is not available on this device.",
        );
        return;
      }

      const safeTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileUri = `${FileSystem.cacheDirectory}herflow-export-${safeTimestamp}.json`;

      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: strings.exportShareDialogTitle,
        });
      } else {
        console.log("Export ready at:", fileUri);
        Alert.alert("Export ready", strings.exportNoShareNotice);
      }
    } catch (err) {
      Alert.alert("Export failed", strings.exportErrorNotice);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF4EB" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 56,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#C0162C", fontSize: 20 }}>←</Text>
          <Text style={{ color: "#C0162C", fontSize: 17, fontWeight: "700" }}>
            {strings.exportTitle}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#3A1A20",
              fontSize: 16,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            {strings.exportHeaderTitle}
          </Text>
          <Text
            style={{
              color: "#8C5F66",
              fontSize: 13,
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            {strings.exportSummary}
          </Text>

          <TouchableOpacity
            onPress={handleExport}
            style={{
              backgroundColor: "#C0162C",
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
              opacity: isExporting ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
              {isExporting ? strings.exportButtonLoading : strings.exportButton}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18 }}
        >
          <Text
            style={{
              color: "#3A1A20",
              fontSize: 14,
              fontWeight: "800",
              marginBottom: 6,
            }}
          >
            {strings.exportIncludedTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.exportIncludedItems.join("\n")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
