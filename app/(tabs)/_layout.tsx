import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "onboarding",
};

// Root layout — onboarding lives outside the tab navigator as a stack screen.
// Once a user completes onboarding, they get pushed to the (tabs) group.
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Entry point — onboarding runs before any tab is shown */}
      <Stack.Screen name="onboarding" />

      {/* Auth */}
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />

      {/* Profile setup — runs once after first login */}
      <Stack.Screen name="profile-setup" />

      {/* Main app */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
