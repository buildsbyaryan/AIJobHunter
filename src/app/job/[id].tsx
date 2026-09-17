import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSavedJobs } from "../../context/SavedJobsContext";
import { getJobById } from "../../services/jobService";
import { Job } from "../../types/job";

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const { savedJobs, saveJob, removeSavedJob } = useSavedJobs();

  const saved = job
    ? savedJobs.some((savedJob) => savedJob.id === job.id)
    : false;

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);

      const jobId = Number(id);

      if (!jobId || Number.isNaN(jobId)) {
        throw new Error("Invalid job ID");
      }

      console.log("=================================");
      console.log("FETCH JOB DETAILS START");
      console.log("JOB ID:", jobId);
      console.log("=================================");

      const jobData = await getJobById(jobId);

      console.log("JOB DETAILS SUCCESS:");
      console.log(jobData);

      setJob(jobData);
    } catch (error: any) {
      console.log("=================================");
      console.log("FETCH JOB ERROR");
      console.log("=================================");

      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
      } else {
        console.log("MESSAGE:", error.message);
      }

      Alert.alert("Error", "Unable to load job details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    if (!job) return;

    try {
      if (saved) {
        await removeSavedJob(job.id);
      } else {
        const normalizedJob = {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          experience: job.experience ?? undefined,
          salary: job.salary ?? undefined,
          description: job.description ?? undefined,
          requirements: job.requirements ?? undefined,
          skills: job.skills ?? [],
          createdAt: job.createdAt,
        };

        await saveJob(normalizedJob);
      }
    } catch (error) {
      console.log("SAVE JOB ERROR:", error);

      Alert.alert("Error", "Unable to update saved job.");
    }
  };

  const handleApply = async () => {
    if (!job) return;

    try {
      setApplying(true);

      Alert.alert(
        "Apply Job",
        `Application started for ${job.title} at ${job.company}.`,
      );
    } catch (error) {
      console.log("APPLY ERROR:", error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading job...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Job not found.</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Text style={styles.headerButtonText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Job Details</Text>

        <TouchableOpacity style={styles.headerButton} onPress={handleSaveJob}>
          <Text style={styles.saveIcon}>{saved ? "★" : "☆"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* JOB HEADER */}
        <View style={styles.jobHeader}>
          <View style={styles.companyLogo}>
            <Text style={styles.companyLogoText}>
              {job.company?.charAt(0)?.toUpperCase() ?? "J"}
            </Text>
          </View>

          <View style={styles.jobHeaderInfo}>
            <Text style={styles.title}>{job.title}</Text>

            <Text style={styles.company}>{job.company}</Text>

            <Text style={styles.location}>📍 {job.location}</Text>
          </View>
        </View>

        {/* JOB INFO */}
        <View style={styles.infoContainer}>
          {job.experience && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Experience</Text>

              <Text style={styles.infoValue}>{job.experience}</Text>
            </View>
          )}

          {job.salary && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Salary</Text>

              <Text style={styles.infoValue}>{job.salary}</Text>
            </View>
          )}

          {job.type && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Job Type</Text>

              <Text style={styles.infoValue}>{job.type}</Text>
            </View>
          )}
        </View>

        {/* DESCRIPTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>

          <Text style={styles.description}>
            {job.description || "No description available."}
          </Text>
        </View>

        {/* REQUIREMENTS */}
        {job.requirements && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>

            <Text style={styles.description}>{job.requirements}</Text>
          </View>
        )}

        {/* SKILLS */}
        {job.skills && job.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>

            <View style={styles.skillsContainer}>
              {job.skills.map((skill, index) => (
                <View key={`${skill}-${index}`} style={styles.skill}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[styles.saveButton, saved && styles.savedButton]}
          onPress={handleSaveJob}
        >
          <Text style={styles.saveButtonText}>
            {saved ? "★  Saved Job" : "☆  Save Job"}
          </Text>
        </TouchableOpacity>

        {/* APPLY BUTTON */}
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          disabled={applying}
        >
          {applying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.applyButtonText}>Apply Now</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },

  header: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  headerButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  headerButtonText: {
    fontSize: 36,
    lineHeight: 40,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  saveIcon: {
    fontSize: 28,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  jobHeader: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    marginBottom: 16,
  },

  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#e8eefc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  companyLogoText: {
    fontSize: 26,
    fontWeight: "700",
  },

  jobHeaderInfo: {
    flex: 1,
  },

  title: {
    fontSize: 21,
    fontWeight: "700",
    marginBottom: 5,
  },

  company: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  location: {
    fontSize: 14,
  },

  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },

  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    minWidth: "30%",
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  skill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#eef2ff",
    borderRadius: 20,
  },

  skillText: {
    fontSize: 13,
    fontWeight: "600",
  },

  saveButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  savedButton: {
    backgroundColor: "#f1f1f1",
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  applyButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f7fb",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
  },

  errorText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },

  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#000",
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
