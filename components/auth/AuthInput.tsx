import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
  leftIcon?: React.ReactNode;
};

export default function AuthInput({ label, leftIcon, ...inputProps }: Props) {
  return (
    <View className="mb-4">
      {/* Label */}
      <Text className="text-[#3A1A20] text-sm font-semibold mb-1.5 ml-1">
        {label}
      </Text>

      {/* Pill input row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F2D0D5",
          borderRadius: 50,
          paddingHorizontal: 18,
          paddingVertical: 14,
        }}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          {...inputProps}
          placeholderTextColor="#B08890"
          style={{
            flex: 1,
            fontSize: 14,
            color: "#3A1A20",
          }}
        />
      </View>
    </View>
  );
}
