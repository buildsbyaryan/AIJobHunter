import { useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";

interface JobCardProps {
  id: string;
  company: string;
  title: string;
  location: string;
  salary: string;
  type: string;
  description: string;
}

export default function JobCard({
  id,
  company,
  title,
  location,
  salary,
  type,
  description,
}: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <View style={styles.jobCard}>
      <Text style={styles.company}>{company}</Text>

      <Text style={styles.jobTitle}>{title}</Text>

      <Text style={styles.location}>📍 {location}</Text>

      <Text style={styles.salary}>💰 {salary}</Text>

      <Text style={styles.type}>💼 {type}</Text>

      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      <View style={styles.buttonContainer}>
        {/* VIEW DETAILS */}

        <Pressable
          style={styles.detailsButton}
          onPress={() => {
            router.push({
              pathname: "/job/[id]",
              params: {
                id: id,
              },
            });
          }}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </Pressable>

        {/* SAVE */}

        <Pressable
          style={[styles.saveButton, isSaved && styles.savedButton]}
          onPress={() => {
            setIsSaved(!isSaved);
          }}
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
    marginTop: 12,
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
