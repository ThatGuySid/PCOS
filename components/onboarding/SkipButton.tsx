import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  onPress: () => void;
};

export default function SkipButton({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.label}>Skip</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 14,
  },
  label: {
    color: "#B79AA0",
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.9,
  },
});
