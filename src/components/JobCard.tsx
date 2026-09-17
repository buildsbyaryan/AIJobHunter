import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Job } from "../types/job";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();

  const { id, title, company, location, type, experience, salary } = job;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/job/${id}`)}
    >
      <View style={styles.topRow}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>
            {company?.charAt(0).toUpperCase() || "J"}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          <Text style={styles.company}>{company}</Text>
        </View>

        <Ionicons name="bookmark-outline" size={22} color="#777" />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={16} color="#777" />

          <Text style={styles.infoText}>{location}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="briefcase-outline" size={16} color="#777" />

          <Text style={styles.infoText}>{type}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View>
          {experience && (
            <Text style={styles.experience}>{experience} years</Text>
          )}

          {salary && <Text style={styles.salary}>{salary}</Text>}
        </View>

        <View style={styles.detailsButton}>
          <Text style={styles.detailsText}>View Details</Text>

          <Ionicons name="arrow-forward" size={15} color="#111" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  pressed: {
    opacity: 0.75,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  logoText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 4,
  },

  company: {
    fontSize: 14,
    color: "#666666",
  },

  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 14,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    marginLeft: 5,
    fontSize: 13,
    color: "#666666",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  experience: {
    fontSize: 12,
    color: "#777777",
    marginBottom: 4,
  },

  salary: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  detailsText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
  },
});
