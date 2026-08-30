import { StyleSheet, Text, View } from "react-native";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚠️ {message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },

  text: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
  },
});
