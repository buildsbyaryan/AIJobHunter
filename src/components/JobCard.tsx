import { useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

interface JobCardProps {
  company: string;
  title: string;
  location: string;
  salary: string;
  type: string;
  description: string;
}

export default function JobCard({
  company,
  title,
  location,
  salary,
  type,
  description,
}: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  return (
    <View style={styles.jobCard}>
      {/* Company */}

      <Text style={styles.company}>{company}</Text>

      {/* Job Title */}

      <Text style={styles.jobTitle}>{title}</Text>

      {/* Location */}

      <Text style={styles.location}>📍 {location}</Text>

      {/* Salary */}

      <Text style={styles.salary}>💰 {salary}</Text>

      {/* Job Type */}

      <Text style={styles.type}>💼 {type}</Text>

      {/* Description */}

      {showDetails && <Text style={styles.description}>{description}</Text>}

      {/* Buttons */}

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.detailsButton}
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text style={styles.detailsButtonText}>
            {showDetails ? "Hide Details" : "View Details"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.saveButton, isSaved && styles.savedButton]}
          onPress={() => setIsSaved(!isSaved)}
        >
          <Text
            style={[styles.saveButtonText, isSaved && styles.savedButtonText]}
          >
            {isSaved ? "Saved ✓" : "Save Job"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  jobCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
  },

  company: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },

  jobTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111111",
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
    color: "#111111",
    marginTop: 8,
  },

  type: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#666666",
    marginTop: 15,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  detailsButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#111111",
  },

  detailsButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#111111",
  },

  saveButtonText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
  },

  savedButton: {
    backgroundColor: "#111111",
  },

  savedButtonText: {
    color: "#ffffff",
  },
});
