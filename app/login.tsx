import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

function Orb({
  size,
  color,
  style,
}: {
  size: number;
  color: string;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          position: "absolute",
          opacity: 0.15,
        },
        style,
      ]}
    />
  );
}

function FloatingInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          color: focused ? "#C0162C" : "#9A6070",
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor: focused ? "#C0162C" : "#EAB4BD",
          backgroundColor: focused ? "#FFF5F6" : "#fff",
          paddingHorizontal: 18,
          paddingVertical: 14,
          shadowColor: focused ? "#C0162C" : "transparent",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: focused ? 4 : 0,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#D9A0AC"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? "none"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ color: "#3A0A12", fontSize: 15, fontWeight: "500" }}
        />
      </View>
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const btnScale = useRef(new Animated.Value(1)).current;

  const handleLogin = () => {
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(btnScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => router.replace("/profile-setup"));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FEF4F5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Orb size={300} color="#E8556A" style={{ top: -120, right: -100 }} />
      <Orb size={200} color="#F4A0B0" style={{ bottom: 100, left: -80 }} />
      <Orb size={120} color="#C0162C" style={{ bottom: 300, right: -30 }} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 28,
          paddingVertical: 60,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 48 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              backgroundColor: "#C0162C",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
              shadowColor: "#C0162C",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.35,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Text style={{ fontSize: 34 }}>🌸</Text>
          </View>
          <Text
            style={{
              color: "#C0162C",
              fontSize: 38,
              fontWeight: "900",
              letterSpacing: -1,
            }}
          >
            herFlow
          </Text>
          <Text
            style={{
              color: "#9A6070",
              fontSize: 14,
              marginTop: 6,
              letterSpacing: 0.3,
            }}
          >
            Your personal cycle companion
          </Text>
        </View>

        {/* Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 28,
            padding: 24,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 6,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: "#3A0A12",
              fontSize: 22,
              fontWeight: "800",
              marginBottom: 22,
            }}
          >
            Welcome back
          </Text>
          <FloatingInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
          />
          <FloatingInput
            label="Password"
            value={pass}
            onChangeText={setPass}
            placeholder="••••••••"
            secureTextEntry
          />

          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginTop: -4, marginBottom: 20 }}
          >
            <Text style={{ color: "#C0162C", fontSize: 12, fontWeight: "600" }}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.9}
              style={{
                backgroundColor: "#C0162C",
                borderRadius: 18,
                paddingVertical: 18,
                alignItems: "center",
                shadowColor: "#C0162C",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: "800",
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                Sign In →
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ color: "#9A6070", fontSize: 14 }}>New here? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={{ color: "#C0162C", fontSize: 14, fontWeight: "700" }}>
              Create account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
