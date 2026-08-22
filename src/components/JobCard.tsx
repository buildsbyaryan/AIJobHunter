import { Pressable, StyleSheet, Text, View } from "react-native";

export default function JobCard() {
  return (
    <View style={styles.jobCard}>
      <Text style={styles.company}>Google</Text>

      <Text style={styles.jobTitle}>Software Engineer</Text>

      <Text style={styles.location}>📍 Bangalore</Text>

      <Text style={styles.salary}>₹8–15 LPA</Text>

      <Pressable
        style={styles.viewButton}
        onPress={() => console.log("View Job pressed")}
      >
        <Text style={styles.viewButtonText}>View Job</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  jobCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
  },

  company: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "600",
  },

  jobTitle: {
    fontSize: 21,
    fontWeight: "700",
    marginTop: 6,
  },

  location: {
    fontSize: 15,
    color: "#666666",
    marginTop: 12,
  },

  salary: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },

  viewButton: {
    marginTop: 18,
    backgroundColor: "#111111",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  viewButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
