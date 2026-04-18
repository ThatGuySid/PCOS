import { Image, ImageSourcePropType, View } from "react-native";

type Props = {
  avatarIndex: number | null;
};

const AVATARS: ImageSourcePropType[] = [
  require("@/assets/images/ProfileAvatar1.png"),
  require("@/assets/images/ProfileAvatar2.png"),
  require("@/assets/images/ProfileAvatar3.png"),
  require("@/assets/images/ProfileAvatar4.png"),
  require("@/assets/images/ProfileAvatar5.png"),
  require("@/assets/images/ProfileAvatar6.png"),
];

export default function AvatarDisplay({ avatarIndex }: Props) {
  const avatarSource = AVATARS[avatarIndex ?? 0];

  return (
    <View className="items-center mb-6" style={{ marginTop: -10 }}>
      {/* Outer circle */}
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          overflow: "hidden",
          // Light blue tint border
          borderWidth: 3,
          borderColor: "#AED6F1",
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
      </View>
    </View>
  );
}
