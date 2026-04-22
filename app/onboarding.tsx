import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import OnboardingSlide from "@/components/onboarding/OnboardingSlide";

// Slide content data
const SLIDES = [
  {
    title: "Track Your Cycle",
    description:
      "Log periods, symptoms, and moods effortlessly. We help you understand your body.",
    buttonLabel: "Continue →",
  },
  {
    title: "Personalized Tips",
    description:
      "Get personalized food suggestions, exercise tips, and wellness advice based on your cycle.",
    buttonLabel: "Continue →",
  },
  {
    title: "Your Wellness Hub",
    description:
      "Medicine reminders, health reports, and a personal AI assistant, all in one place.",
    buttonLabel: "Let's Start →",
  },
];

type Step = 0 | 1 | 2;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);

  // Advance to next slide, or go to login on last
  const handleContinue = () => {
    if (step < 2) {
      setStep((step + 1) as Step);
    } else {
      // Navigate to login
      router.replace("./login");
    }
  };

  // Skip jumps straight to login
  const handleSkip = () => {
    router.replace("./login");
  };

  return (
    <View style={{ flex: 1 }}>
      <OnboardingSlide
        title={SLIDES[step].title}
        description={SLIDES[step].description}
        buttonLabel={SLIDES[step].buttonLabel}
        onContinue={handleContinue}
        onSkip={handleSkip}
        isLast={step === 2}
      />
    </View>
  );
}
