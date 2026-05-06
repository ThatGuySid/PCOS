import { UserProvider, useUser } from "@/context/UserContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";

function AuthGuard() {
  const { firebaseUser, isAuthLoading, isProfileHydrated, hasStartedJourney } =
    useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    const isOnboardingRoute = segments[0] === "onboarding";
    const inAuthGroup =
      segments[0] === "login" ||
      segments[0] === "signup" ||
      segments[0] === undefined;
    const isProfileSetupRoute = segments[0] === "profile-setup";

    if (firebaseUser) {
      if (!isProfileHydrated) {
        return;
      }

      // If signed in but journey has not started yet, force setup.
      if (!hasStartedJourney && !isProfileSetupRoute) {
        router.replace("/profile-setup");
        return;
      }

      // If journey has started and user is on auth/onboarding/setup, send to app.
      if (
        hasStartedJourney &&
        (inAuthGroup || isOnboardingRoute || isProfileSetupRoute)
      ) {
        router.replace("/(tabs)");
        return;
      }
    }

    if (!firebaseUser && !isOnboardingRoute && !inAuthGroup) {
      router.replace("/onboarding");
    }
  }, [
    firebaseUser,
    isAuthLoading,
    isProfileHydrated,
    hasStartedJourney,
    segments,
  ]);

  return null;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }} />
    </UserProvider>
  );
}
