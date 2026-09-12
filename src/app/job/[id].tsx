import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getJobById } from "../../services/jobService";
import { Job } from "../../types/job";

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const loadJob = async () => {
    try {
      if (!id) return;

      const data = await getJobById(Number(id));

      setJob(data);
    } catch (error: any) {
      console.error("GET JOB DETAILS ERROR:", error?.response?.data || error);

      Alert.alert("Error", "Unable to load job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Job not found</Text>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#111111" />
          </Pressable>

          <Text style={styles.headerTitle}>Job Details</Text>

          <Pressable style={styles.iconButton}>
            <Ionicons name="bookmark-outline" size={22} color="#111111" />
          </Pressable>
        </View>

        {/* Company Icon */}
        <View style={styles.companyIcon}>
          <Text style={styles.companyLetter}>
            {job.company.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Main Information */}
        <Text style={styles.title}>{job.title}</Text>

        <Text style={styles.company}>{job.company}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={17} color="#777777" />

            <Text style={styles.infoText}>{job.location}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="briefcase-outline" size={17} color="#777777" />

            <Text style={styles.infoText}>{job.type}</Text>
          </View>
        </View>

        {/* Salary */}
        <View style={styles.salaryCard}>
          <View style={styles.salaryIcon}>
            <Ionicons name="cash-outline" size={23} color="#111111" />
          </View>

          <View>
            <Text style={styles.salaryLabel}>Salary</Text>

            <Text style={styles.salaryValue}>
              {job.salary || "Not specified"}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Job Description</Text>

        <Text style={styles.description}>
          {job.description || "No job description available for this position."}
        </Text>

        {/* Apply Button */}
        <Pressable
          style={({ pressed }) => [
            styles.applyButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            Alert.alert(
              "Coming Soon",
              "Job application functionality will be available soon.",
            );
          }}
        >
          <Text style={styles.applyText}>Apply Now</Text>

          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    color: "#777777",
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 35,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111111",
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },

  companyIcon: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  companyLetter: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "800",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
    marginTop: 24,
  },

  company: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777777",
    textAlign: "center",
    marginTop: 8,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginTop: 22,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  infoText: {
    fontSize: 13,
    color: "#777777",
  },

  salaryCard: {
    marginTop: 30,
    backgroundColor: "#f7f7f7",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  salaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  salaryLabel: {
    fontSize: 12,
    color: "#777777",
  },

  salaryValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111111",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
    marginTop: 32,
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 25,
    color: "#666666",
  },

  applyButton: {
    height: 56,
    borderRadius: 15,
    backgroundColor: "#111111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 35,
  },

  pressed: {
    opacity: 0.7,
  },

  applyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  backButton: {
    backgroundColor: "#111111",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  backButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
