import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ── Checkbox ──────────────────────────────────────────────────────────────────
// ponytail: no checkbox component exists in the codebase and no new dependency
// is needed for one square + checkmark — reusing the "✓ CHOSEN" pattern from
// profile-setup.tsx's AvatarCard.
function ConsentCheckbox({
  checked,
  onPress,
  children,
}: {
  checked: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: "#C0162C",
          backgroundColor: checked ? "#C0162C" : "#fff",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        {checked && (
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>
            ✓
          </Text>
        )}
      </View>
      <Text style={{ flex: 1, color: "#3A1A20", fontSize: 13, lineHeight: 19 }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function InfoCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 18,
        marginBottom: 14,
      }}
    >
      <Text
        style={{
          color: "#3A1A20",
          fontSize: 14,
          fontWeight: "800",
          marginBottom: 6,
        }}
      >
        {title}
      </Text>
      <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
        {body}
      </Text>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function ConsentScreen() {
  const router = useRouter();
  const { setUser, signOutUser } = useUser();
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    if (!agreed) return;
    setUser({
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
    });
    // AuthGuard will redirect to /profile-setup once hasConsented flips true.
  };

  const handleDecline = async () => {
    await signOutUser();
    router.replace("/login");
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
        <Text
          style={{
            color: "#C0162C",
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: 0.6,
            marginBottom: 6,
          }}
        >
          Before you continue
        </Text>
        <Text
          style={{
            color: "#3A0A12",
            fontSize: 26,
            fontWeight: "900",
            marginBottom: 20,
          }}
        >
          Your data, your choice
        </Text>

        <InfoCard
          title="Health data we collect"
          body="To personalise your experience, HerFlow collects the profile details, period/cycle dates, and symptoms you enter, along with your avatar choice and any medication reminders you set up."
        />

        <InfoCard
          title="AI Assistant"
          body="Messages you send to the AI Assistant, along with relevant cycle context, are shared with Google to generate a reply. Google may retain that data under its own policies, so don't share anything in the chat that you wouldn't want processed by a third party."
        />

        <View style={{ flexDirection: "row", gap: 18, marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.push("/privacy-policy")}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/terms")}>
            <Text style={styles.link}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 18,
            marginBottom: 24,
          }}
        >
          <ConsentCheckbox checked={agreed} onPress={() => setAgreed((v) => !v)}>
            I agree to HerFlow collecting and processing the health data
            described above, to my AI Assistant messages being shared with
            Google as described, and to the Privacy Policy and Terms &
            Conditions.
          </ConsentCheckbox>
        </View>

        <TouchableOpacity
          onPress={handleAgree}
          disabled={!agreed}
          activeOpacity={0.9}
          style={{
            backgroundColor: agreed ? "#C0162C" : "#E4A8B2",
            borderRadius: 20,
            paddingVertical: 18,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: "800",
              letterSpacing: 0.5,
            }}
          >
            Agree & Continue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDecline}
          activeOpacity={0.75}
          style={{ paddingVertical: 10, alignItems: "center" }}
        >
          <Text style={{ color: "#9A6070", fontSize: 13, fontWeight: "600" }}>
            Decline & sign out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    color: "#C0162C",
    fontSize: 13,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
