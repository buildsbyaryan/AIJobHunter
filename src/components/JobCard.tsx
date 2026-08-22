import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface JobCardProps {
  company: string;
  title: string;
  location: string;
  salary: string;
}

export default function JobCard({
  company,
  title,
  location,
  salary,
}: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  return (
    <View style={styles.jobCard}>
      <Text style={styles.company}>{company}</Text>

      <Text style={styles.jobTitle}>{title}</Text>

      <Text style={styles.location}>📍 {location}</Text>

      <Text style={styles.salary}>{salary}</Text>

      <Pressable style={styles.viewButton} onPress={() => setIsSaved(!isSaved)}>
        <Text style={styles.viewButtonText}>
          {isSaved ? "Saved ✓" : "Save Job"}
        </Text>
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
