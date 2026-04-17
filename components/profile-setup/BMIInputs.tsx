import { View, Text, TouchableOpacity, TextInput } from "react-native";

type BMIState = {
  height: string;
  weight: string;
};

type ActiveField = "height" | "weight" | null;

type Props = {
  values: BMIState;
  activeField: ActiveField;
  onFieldPress: (field: ActiveField) => void;
  onChange: (field: keyof BMIState, value: string) => void;
};

// Each pill: shows label when inactive, reveals numeric TextInput when tapped
export default function BMIInputs({
  values,
  activeField,
  onFieldPress,
  onChange,
}: Props) {
  const renderPill = (field: "height" | "weight", label: string, unit: string) => {
    const isActive = activeField === field;
    const hasValue = values[field].length > 0;

    return (
      <TouchableOpacity
        onPress={() => onFieldPress(field)}
        activeOpacity={0.8}
        style={{
          width: "47%",
          paddingVertical: isActive ? 10 : 14,
          paddingHorizontal: 16,
          borderRadius: 50,
          borderWidth: 1.5,
          borderColor: isActive ? "#C0162C" : "#E8A0A8",
          backgroundColor: isActive ? "#F7DDE0" : "transparent",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {isActive ? (
          <>
            <TextInput
              autoFocus
              keyboardType="numeric"
              value={values[field]}
              onChangeText={(val) => onChange(field, val)}
              placeholder="0"
              placeholderTextColor="#B08890"
              style={{
                color: "#C0162C",
                fontSize: 15,
                fontWeight: "700",
                minWidth: 40,
                textAlign: "center",
              }}
            />
            <Text style={{ color: "#8C5F66", fontSize: 13 }}>{unit}</Text>
          </>
        ) : (
          <Text
            style={{
              color: hasValue ? "#C0162C" : "#8C5F66",
              fontWeight: hasValue ? "700" : "400",
              fontSize: 14,
            }}
          >
            {hasValue ? `${values[field]} ${unit}` : label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {/* Section label */}
      <Text className="text-[#C0162C] text-base font-semibold mb-3">BMI</Text>

      <View className="flex-row flex-wrap gap-3">
        {renderPill("height", "Height", "cm")}
        {renderPill("weight", "Weight", "kg")}
      </View>
    </View>
  );
}
