import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    // later: validation / auth
    router.replace("/profile-setup"); // 👈 goes to ProfileSetupScreen
  };

  const handleSignup = () => {
    // TODO: create signup.tsx page later
    router.push("/signup");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>❤️</Text>
        <Text style={styles.title}>herFlow</Text>
        <Text style={styles.subtitle}>Your personal cycle companion</Text>
      </View>

      {/* Inputs */}
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Password</Text>
        <TextInput
          value={pass}
          onChangeText={setPass}
          placeholder="••••••••"
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        Don't have an account?{" "}
        <Text style={styles.signup} onPress={handleSignup}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
}

const COLORS = {
  crimson: "#C0162C",
  blush: "#F7DDE0",
  offWhite: "#FBF5F5",
  text: "#3A1A20",
  mutedText: "#8C5F66",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    fontSize: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.crimson,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.blush,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.crimson,
    paddingVertical: 12,
    borderRadius: 25,
    width: "70%",
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 15,
    fontSize: 13,
    color: COLORS.mutedText,
  },
  signup: {
    color: COLORS.crimson,
    fontWeight: "bold",
  },
});
