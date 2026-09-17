import { Pressable, StyleSheet, Text } from "react-native";

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function FilterChip({
  label,
  selected,
  onPress,
}: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
    marginRight: 8,
    marginBottom: 8,
  },

  selectedChip: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },

  text: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },

  selectedText: {
    color: "#ffffff",
  },
});
