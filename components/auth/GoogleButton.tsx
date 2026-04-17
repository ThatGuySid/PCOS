import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";

type Props = {
  onSuccess: (idToken: string) => void;
  onError?: (error: string) => void;
};

// Call GoogleSignin.configure() once at app startup (e.g. in _layout.tsx):
//
//   GoogleSignin.configure({
//     webClientId: "YOUR_WEB_CLIENT_ID_HERE", // ← replace with your client ID
//   });
//
// This component handles the sign-in flow and returns the idToken on success.

export default function GoogleButton({ onSuccess, onError }: Props) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (idToken) {
        onSuccess(idToken);
      } else {
        onError?.("No ID token returned from Google.");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled — no need to show error
      } else if (error.code === statusCodes.IN_PROGRESS) {
        onError?.("Sign-in already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        onError?.("Google Play Services not available.");
      } else {
        onError?.(error.message ?? "Google sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleGoogleSignIn}
      activeOpacity={0.85}
      disabled={loading}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 50,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderWidth: 1.5,
        borderColor: "#E8A0A8",
        gap: 10,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#C0162C" />
      ) : (
        <>
          {/* Google "G" logo — drawn as SVG-like coloured text approximation */}
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#E0E0E0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#4285F4" }}>
              G
            </Text>
          </View>
          <Text
            style={{
              color: "#3A1A20",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            Continue with Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
