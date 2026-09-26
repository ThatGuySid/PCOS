import { View, ViewStyle } from "react-native";

const GRID = [
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];

type PixelHeartProps = {
  pixelSize?: number;
  color?: string;
  containerStyle?: ViewStyle;
};

export function PixelHeart({
  pixelSize = 10,
  color = "#C0162C",
  containerStyle,
}: PixelHeartProps) {
  return (
    <View style={containerStyle}>
      {GRID.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row" }}>
          {row.map((cell, ci) => (
            <View
              key={ci}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: cell ? color : "transparent",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
