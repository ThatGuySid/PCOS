import SplashScreen from "@/components/onboarding/SplashScreen";
import { useUser } from "@/context/UserContext";
import { Redirect } from "expo-router";
import { useState } from "react";

export default function Index() {
  const { firebaseUser } = useUser();
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = () => {
    setSplashDone(true);
  };

  if (!splashDone) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <Redirect href={firebaseUser ? "/(tabs)" : "/onboarding"} />;
}
