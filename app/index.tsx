import SplashScreen from "@/components/onboarding/SplashScreen";
import { useUser } from "@/context/UserContext";
import { Redirect } from "expo-router";
import { useState } from "react";

export default function Index() {
  const { firebaseUser, isAuthLoading, hasStartedJourney } = useUser();
  const [splashDone, setSplashDone] = useState(false);

  console.log("[index] render", {
    splashDone,
    isAuthLoading,
    firebaseUser: !!firebaseUser,
    hasStartedJourney,
  });

  const handleSplashFinish = () => {
    setSplashDone(true);
  };

  if (!splashDone) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (isAuthLoading) {
    console.log("[index] waiting for auth loading");
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (firebaseUser) {
    console.log("[index] redirect -> /(tabs)");
    return <Redirect href="/(tabs)" />;
  }

  console.log(
    "[index] redirect",
    hasStartedJourney ? "-> /login" : "-> /onboarding",
  );
  return <Redirect href={hasStartedJourney ? "/login" : "/onboarding"} />;
}
