import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import OnboardingSlide from "@/components/onboarding/OnboardingSlide";
import SplashScreen from "@/components/onboarding/SplashScreen";

const SLIDES = [
  {
    title: "Track Your Cycle",
    description:
      "Log periods, symptoms, and moods effortlessly. We help you understand your body deeply.",
    buttonLabel: "Continue",
  },
  {
    title: "Personalised Tips",
    description:
      "Get AI-powered food suggestions, exercise tips, and wellness advice tailored to your cycle phase.",
    buttonLabel: "Continue",
  },
  {
    title: "Your Wellness Hub",
    description:
      "Medicine reminders, health reports, and a personal AI assistant — all beautifully in one place.",
    buttonLabel: "Let's Begin",
  },
];

type Step = "splash" | 0 | 1 | 2;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("splash");

  return (
    <View style={{ flex: 1 }}>
      {step === "splash" ? (
        <SplashScreen onFinish={() => setStep(0)} />
      ) : (
        <OnboardingSlide
          title={SLIDES[step as number].title}
          description={SLIDES[step as number].description}
          buttonLabel={SLIDES[step as number].buttonLabel}
          slideIndex={step as number}
          onContinue={() => {
            if ((step as number) < 2) setStep(((step as number) + 1) as Step);
            else router.replace("./login");
          }}
          onSkip={() => router.replace("./login")}
          isLast={step === 2}
        />
      )}
    </View>
  );
}
