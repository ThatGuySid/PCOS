import SplashScreen from "@/components/onboarding/SplashScreen";
import { useUser } from "@/context/UserContext";
import { Redirect } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function Index() {
  const { user, isHydrated } = useUser();
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = () => {
    setSplashDone(true);
  };

  if (!splashDone) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Wait for context to hydrate from AsyncStorage before deciding route
  if (!isHydrated) {
    return <View style={{ flex: 1 }} />;
  }

  // After splash and hydration, check if user has completed profile setup
  // If avatarIndex is null, they haven't gone through profile setup yet
  const isNewUser = user.avatarIndex === null;

  if (isNewUser) {
    return <Redirect href="/onboarding" />;
  } else {
    return <Redirect href="/(tabs)" />;
  }
}
