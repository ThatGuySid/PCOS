import { UserProvider, useUser } from "@/context/UserContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";

function AuthGuard() {
  const {
    firebaseUser,
    isAuthLoading,
    isProfileHydrated,
    hasStartedJourney,
    hasConsented,
  } = useUser();
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
    const isConsentRoute = segments[0] === "consent";
    // Legal pages must be viewable before an account exists and during consent.
    const isLegalRoute =
      segments[0] === "privacy-policy" || segments[0] === "terms";
    const isPubliclyViewableRoute =
      isOnboardingRoute || inAuthGroup || isLegalRoute;

    console.log("[AuthGuard] evaluate", {
      segments,
      firebaseUser: !!firebaseUser,
      isAuthLoading,
      isProfileHydrated,
      hasStartedJourney,
      hasConsented,
      isOnboardingRoute,
      inAuthGroup,
      isProfileSetupRoute,
      isConsentRoute,
    });

    if (firebaseUser) {
      if (!isProfileHydrated) {
        console.log("[AuthGuard] waiting for profile hydration");
        return;
      }

      if (!hasStartedJourney) {
        // Let users read the legal pages without being bounced back.
        if (isLegalRoute) return;

        // New / not-yet-onboarded accounts must consent before profile setup.
        if (!hasConsented && !isConsentRoute) {
          console.log("[AuthGuard] redirect -> /consent");
          router.replace("/consent");
          return;
        }

        if (hasConsented && !isProfileSetupRoute) {
          console.log("[AuthGuard] redirect -> /profile-setup");
          router.replace("/profile-setup");
          return;
        }
      }

      // If journey has started and user is on auth/onboarding/setup/consent, send to app.
      if (
        hasStartedJourney &&
        (inAuthGroup || isOnboardingRoute || isProfileSetupRoute || isConsentRoute)
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

    if (!firebaseUser && !isPubliclyViewableRoute) {
      console.log("[AuthGuard] redirect -> /onboarding");
      router.replace("/onboarding");
    }
  }, [
    firebaseUser,
    isAuthLoading,
    isProfileHydrated,
    hasStartedJourney,
    hasConsented,
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
