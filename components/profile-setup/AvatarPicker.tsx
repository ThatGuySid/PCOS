import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  selected: number | null;
  onSelect: (index: number) => void;
};

const AVATARS: ImageSourcePropType[] = [
  require("@/assets/images/ProfileAvatar1.png"),
  require("@/assets/images/ProfileAvatar2.png"),
  require("@/assets/images/ProfileAvatar3.png"),
  require("@/assets/images/ProfileAvatar4.png"),
  require("@/assets/images/ProfileAvatar5.png"),
  require("@/assets/images/ProfileAvatar6.png"),
];

export default function AvatarPicker({ selected, onSelect }: Props) {
  return (
    <View>
      {/* Section label */}
      <Text className="text-[#C0162C] text-base font-semibold mb-3">
        Choose Your Avatar
      </Text>

      {/* 2x3 grid */}
      <View className="flex-row flex-wrap gap-3">
        {AVATARS.map((avatarSource, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(index)}
            activeOpacity={0.8}
            style={{
              width: "30%",
              aspectRatio: 1,
              borderRadius: 12,
              borderWidth: selected === index ? 3 : 0,
              borderColor: "#C0162C",
              overflow: "hidden",
            }}
          >
            <Image
              source={avatarSource}
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
