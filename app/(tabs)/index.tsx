import { useUser } from "@/context/UserContext";
import { ScrollView, View } from "react-native";

import AvatarDisplay from "@/components/home/AvatarDisplay";
import CycleCard from "@/components/home/CycleCard";
import GreetingHeader from "@/components/home/GreetingHeader";

export default function HomeScreen() {
  const { user } = useUser();

  return (
    // Full blush-pink background matching the design
    <View className="flex-1 bg-[#F7C5CC]">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 56 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo + greeting + subtitle */}
        <GreetingHeader name={user.name} />

        {/* Circular avatar */}
        <AvatarDisplay avatarIndex={user.avatarIndex} />

        {/* Tracker / phase / action card */}
        <CycleCard
          cycleDay={user.cycleDay}
          totalCycleDays={user.totalCycleDays}
          phase={user.cyclePhase}
        />
      </ScrollView>
    </View>
  );
}
