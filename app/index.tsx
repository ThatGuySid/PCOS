import SplashScreen from "@/components/onboarding/SplashScreen";
import { useUser } from "@/context/UserContext";
import { Redirect } from "expo-router";
import { useState } from "react";

export default function Index() {
  const { user } = useUser();
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = () => {
    setSplashDone(true);
  };

  if (!splashDone) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Check if user has completed profile setup
  // If avatarIndex is null, they haven't gone through profile setup yet
  const isNewUser = user.avatarIndex === null;

  if (isNewUser) {
    return <Redirect href="/onboarding" />;
  } else {
    return <Redirect href="/(tabs)" />;
  }
}
