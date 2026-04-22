import AvatarDisplay from "@/components/home/AvatarDisplay";
import CycleCard from "@/components/home/CycleCard";
import GreetingHeader from "@/components/home/GreetingHeader";
import NextPeriodCard from "@/components/home/NextPeriodCard";
import { useUser } from "@/context/UserContext";
import { ScrollView, View } from "react-native";

export default function HomeScreen() {
  const { user, livePhase, liveCycleDay, predictedNextPeriodDateKey } =
    useUser();

  return (
    <View style={{ flex: 1, backgroundColor: "#F7C5CC" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 56,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo + greeting + subtitle */}
        <GreetingHeader name={user.name} />

        {/* Circular avatar */}
        <AvatarDisplay avatarIndex={user.avatarIndex} />

        {/* Tracker / phase / action card */}
        <CycleCard
          cycleDay={liveCycleDay}
          totalCycleDays={user.totalCycleDays}
          phase={livePhase}
        />

        {/* Next period prediction + cycle progress */}
        <NextPeriodCard
          predictedNextPeriodDateKey={predictedNextPeriodDateKey}
          livePhase={livePhase}
          liveCycleDay={liveCycleDay}
          totalCycleDays={user.totalCycleDays}
        />
      </ScrollView>
    </View>
  );
}
