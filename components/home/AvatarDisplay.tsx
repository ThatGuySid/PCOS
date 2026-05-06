import { Image, ImageSourcePropType, Text, View } from "react-native";

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
  const avatarSource = avatarIndex !== null ? AVATARS[avatarIndex] : null;

  return (
    <View className="items-center mb-4" style={{ marginTop: -12 }}>
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
        {avatarSource ? (
          <Image
            source={avatarSource}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FDEDEF",
            }}
          >
            <Text style={{ color: "#C0162C", fontSize: 28, fontWeight: "800" }}>
              ?
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
