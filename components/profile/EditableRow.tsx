import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardTypeOptions } from "react-native";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  onSave: (value: string) => void;
};

// Tapping the row opens an inline TextInput.
// Tapping Save commits the value and collapses back to display mode.
export default function EditableRow({
  label,
  value,
  placeholder = "—",
  keyboardType = "default",
  onSave,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave(draft.trim());
    setEditing(false);
  };

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: "#F2D0D5",
        paddingVertical: 14,
      }}
    >
      <Text style={{ color: "#B08890", fontSize: 11, fontWeight: "600", marginBottom: 4 }}>
        {label.toUpperCase()}
      </Text>

      {editing ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TextInput
            autoFocus
            value={draft}
            onChangeText={setDraft}
            keyboardType={keyboardType}
            returnKeyType="done"
            onSubmitEditing={handleSave}
            style={{
              flex: 1,
              backgroundColor: "#F7DDE0",
              borderRadius: 10,
              paddingVertical: 8,
              paddingHorizontal: 12,
              fontSize: 15,
              color: "#3A1A20",
            }}
          />
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: "#C0162C",
              borderRadius: 10,
              paddingVertical: 8,
              paddingHorizontal: 14,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDraft(value); setEditing(false); }}>
            <Text style={{ color: "#8C5F66", fontSize: 13 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => { setDraft(value); setEditing(true); }}
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
        >
          <Text style={{ color: value ? "#3A1A20" : "#B08890", fontSize: 15 }}>
            {value || placeholder}
          </Text>
          <Text style={{ color: "#C0162C", fontSize: 13, fontWeight: "600" }}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
