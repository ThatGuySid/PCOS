import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Entry point —  */}
        <Stack.Screen name="onboarding" />

        {/* Auth */}
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />

        {/* Profile setup — runs once after first login */}
        <Stack.Screen name="profile-setup" />

        {/* Main app */}
        <Stack.Screen name="(tabs)" />

        {/* Health sub-screens — stack over the tabs */}
        <Stack.Screen name="period-log" />
        <Stack.Screen name="workout" />
        <Stack.Screen name="food-diet" />
        <Stack.Screen name="ai-assistant" />
      </Stack>
    </UserProvider>
  );
}
