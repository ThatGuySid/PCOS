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

    console.log("[AuthGuard] evaluate", {
      segments,
      firebaseUser: !!firebaseUser,
      isAuthLoading,
      isProfileHydrated,
      hasStartedJourney,
      isOnboardingRoute,
      inAuthGroup,
      isProfileSetupRoute,
    });

    if (firebaseUser) {
      if (!isProfileHydrated) {
        console.log("[AuthGuard] waiting for profile hydration");
        return;
      }

      // If signed in but journey has not started yet, force setup.
      if (!hasStartedJourney && !isProfileSetupRoute) {
        console.log("[AuthGuard] redirect -> /profile-setup");
        router.replace("/profile-setup");
        return;
      }

      // If journey has started and user is on auth/onboarding/setup, send to app.
      if (
        hasStartedJourney &&
        (inAuthGroup || isOnboardingRoute || isProfileSetupRoute)
      ) {
        console.log("[AuthGuard] redirect -> /(tabs)");
        router.replace("/(tabs)");
        return;
      }
    }

    // Logged out users who already started their journey should not be forced
    // through onboarding again.
    if (!firebaseUser && hasStartedJourney && isOnboardingRoute) {
      console.log("[AuthGuard] skipping onboarding for returning user");
      console.log("[AuthGuard] redirect -> /login");
      router.replace("/login");
      return;
    }

    if (!firebaseUser && !isOnboardingRoute && !inAuthGroup) {
      console.log("[AuthGuard] redirect -> /onboarding");
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
