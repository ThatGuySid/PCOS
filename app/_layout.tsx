import { UserProvider, useUser } from "@/context/UserContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";

function AuthGuard() {
  const { firebaseUser, isAuthLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    const inAuthGroup =
      segments[0] === "login" ||
      segments[0] === "signup" ||
      segments[0] === "onboarding" ||
      segments[0] === undefined;

    if (!firebaseUser && !inAuthGroup) {
      router.replace("/login");
    } else if (firebaseUser && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [firebaseUser, isAuthLoading, segments]);

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
