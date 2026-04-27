import React from "react";
import { Text, TextInput, View } from "react-native";

export default function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  returnKeyType,
  onSubmitEditing,
  leftIcon,
}: any) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          color: "#9A6070",
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor: "#EAB4BD",
          backgroundColor: "#fff",
          paddingHorizontal: 18,
          paddingVertical: 14,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {leftIcon}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#D9A0AC"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize ?? "none"}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            style={{
              color: "#3A0A12",
              fontSize: 15,
              fontWeight: "500",
              flex: 1,
            }}
          />
        </View>
      </View>
    </View>
  );
}
