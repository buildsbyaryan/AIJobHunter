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

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loaderCard}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </View>
    );
  }

  // =========================
  // JOB NOT FOUND
  // =========================

  if (!job) {
    return (
      <View style={styles.center}>
        <View style={styles.notFoundIcon}>
          <Text style={styles.notFoundIconText}>!</Text>
        </View>

        <Text style={styles.errorTitle}>Job Not Found</Text>

        <Text style={styles.errorText}>
          This job may have been removed or is no longer available.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <View style={styles.container}>
      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Job Details</Text>

        <TouchableOpacity
          style={[styles.headerButton, saved && styles.headerButtonSaved]}
          onPress={handleSaveJob}
          activeOpacity={0.7}
        >
          <Text style={[styles.saveIcon, saved && styles.saveIconActive]}>
            {saved ? "★" : "☆"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* =========================
          CONTENT
      ========================= */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================
            JOB HERO
        ========================= */}

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.companyLogo}>
              <Text style={styles.companyLogoText}>
                {job.company?.charAt(0)?.toUpperCase() ?? "J"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.smallSaveButton}
              onPress={handleSaveJob}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.smallSaveIcon,
                  saved && styles.smallSaveIconActive,
                ]}
              >
                {saved ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{job.title}</Text>

          <Text style={styles.company}>{job.company}</Text>

          <View style={styles.locationRow}>
            <View style={styles.locationIconContainer}>
              <Text style={styles.locationIcon}>⌖</Text>
            </View>

            <Text style={styles.location}>{job.location}</Text>
          </View>

          <View style={styles.heroDivider} />

          <Text style={styles.postedText}>
            Posted recently • Job opportunity
          </Text>
        </View>

        {/* =========================
            QUICK INFORMATION
        ========================= */}

        <View style={styles.quickInfoContainer}>
          {job.experience && (
            <View style={styles.quickInfoCard}>
              <View style={styles.quickInfoIcon}>
                <Text style={styles.quickInfoIconText}>◷</Text>
              </View>

              <Text style={styles.quickInfoLabel}>Experience</Text>

              <Text style={styles.quickInfoValue}>{job.experience}</Text>
            </View>
          )}

          {job.salary && (
            <View style={styles.quickInfoCard}>
              <View style={styles.quickInfoIcon}>
                <Text style={styles.quickInfoIconText}>₹</Text>
              </View>

              <Text style={styles.quickInfoLabel}>Salary</Text>

              <Text style={styles.quickInfoValue}>{job.salary}</Text>
            </View>
          )}

          {job.type && (
            <View style={styles.quickInfoCard}>
              <View style={styles.quickInfoIcon}>
                <Text style={styles.quickInfoIconText}>▣</Text>
              </View>

              <Text style={styles.quickInfoLabel}>Job Type</Text>

              <Text style={styles.quickInfoValue}>{job.type}</Text>
            </View>
          )}
        </View>

        {/* =========================
            ABOUT JOB
        ========================= */}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />

            <Text style={styles.sectionTitle}>About the Job</Text>
          </View>

          <Text style={styles.description}>
            {job.description || "No description available."}
          </Text>
        </View>

        {/* =========================
            REQUIREMENTS
        ========================= */}

        {job.requirements && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />

              <Text style={styles.sectionTitle}>Requirements</Text>
            </View>

            <Text style={styles.description}>{job.requirements}</Text>
          </View>
        )}

        {/* =========================
            SKILLS
        ========================= */}

        {job.skills && job.skills.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />

              <Text style={styles.sectionTitle}>Required Skills</Text>
            </View>

            <View style={styles.skillsContainer}>
              {job.skills.map((skill, index) => (
                <View key={`${skill}-${index}`} style={styles.skill}>
                  <Text style={styles.skillCheck}>✓</Text>

                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* =========================
            COMPANY
        ========================= */}

        <View style={styles.companyCard}>
          <View style={styles.companyCardLogo}>
            <Text style={styles.companyCardLogoText}>
              {job.company?.charAt(0)?.toUpperCase() ?? "J"}
            </Text>
          </View>

          <View style={styles.companyCardInfo}>
            <Text style={styles.companyCardLabel}>Company</Text>

            <Text style={styles.companyCardName}>{job.company}</Text>

            <Text style={styles.companyCardLocation}>{job.location}</Text>
          </View>
        </View>

        {/* =========================
            ACTION BUTTONS
        ========================= */}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saved && styles.savedButton]}
            onPress={handleSaveJob}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.saveButtonIcon, saved && styles.saveButtonIcon]}
            >
              {saved ? "★" : "☆"}
            </Text>

            <Text style={styles.saveButtonText}>
              {saved ? "Saved" : "Save Job"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            disabled={applying}
            activeOpacity={0.85}
          >
            {applying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.applyButtonText}>Apply Now</Text>

                <Text style={styles.applyArrow}>→</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.bottomHint}>
          Make sure your profile and resume are up to date before applying.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // =========================
  // MAIN
  // =========================

  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  // =========================
  // HEADER
  // =========================

  header: {
    height: 64,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEEF2",
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F9",
  },

  headerButtonSaved: {
    backgroundColor: "#FFF8E6",
  },

  backIcon: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "300",
    marginTop: -3,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111318",
  },

  saveIcon: {
    fontSize: 25,
    color: "#44474F",
  },

  saveIconActive: {
    color: "#F5A623",
  },

  // =========================
  // SCROLL
  // =========================

  scrollContent: {
    padding: 16,
    paddingBottom: 35,
  },

  // =========================
  // HERO
  // =========================

  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECEEF3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  companyLogo: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: "#111318",
    alignItems: "center",
    justifyContent: "center",
  },

  companyLogoText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  smallSaveButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F7F7F9",
    alignItems: "center",
    justifyContent: "center",
  },

  smallSaveIcon: {
    fontSize: 24,
    color: "#4A4D55",
  },

  smallSaveIconActive: {
    color: "#F5A623",
  },

  title: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "800",
    color: "#111318",
    marginBottom: 7,
  },

  company: {
    fontSize: 17,
    fontWeight: "700",
    color: "#5B5F69",
    marginBottom: 13,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: "#F0F2F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  locationIcon: {
    fontSize: 17,
    color: "#33363D",
  },

  location: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#686C75",
  },

  heroDivider: {
    height: 1,
    backgroundColor: "#EFF0F3",
    marginVertical: 17,
  },

  postedText: {
    fontSize: 12,
    color: "#8A8E97",
    fontWeight: "500",
  },

  // =========================
  // QUICK INFO
  // =========================

  quickInfoContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  quickInfoCard: {
    flex: 1,
    minHeight: 112,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: "#ECEEF3",
  },

  quickInfoIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#F2F3F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  quickInfoIconText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#22252B",
  },

  quickInfoLabel: {
    fontSize: 11,
    color: "#888C95",
    marginBottom: 4,
    fontWeight: "600",
  },

  quickInfoValue: {
    fontSize: 13,
    color: "#17191E",
    fontWeight: "800",
  },

  // =========================
  // SECTIONS
  // =========================

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECEEF3",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  sectionIndicator: {
    width: 4,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#111318",
    marginRight: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#15171C",
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#60646D",
    fontWeight: "400",
  },

  // =========================
  // SKILLS
  // =========================

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  skill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: "#F5F6F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E9ED",
  },

  skillCheck: {
    fontSize: 12,
    fontWeight: "800",
    marginRight: 6,
    color: "#34373D",
  },

  skillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#363940",
  },

  // =========================
  // COMPANY CARD
  // =========================

  companyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECEEF3",
  },

  companyCardLogo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#111318",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  companyCardLogoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  companyCardInfo: {
    flex: 1,
  },

  companyCardLabel: {
    fontSize: 11,
    color: "#91949C",
    fontWeight: "600",
    marginBottom: 2,
  },

  companyCardName: {
    fontSize: 16,
    color: "#17191E",
    fontWeight: "800",
    marginBottom: 3,
  },

  companyCardLocation: {
    fontSize: 12,
    color: "#777B84",
  },

  // =========================
  // ACTION BUTTONS
  // =========================

  actionsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  saveButton: {
    flex: 0.9,
    height: 55,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#DCDDE2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  savedButton: {
    backgroundColor: "#FFF8E6",
    borderColor: "#F3D38A",
  },

  saveButtonIcon: {
    fontSize: 20,
    color: "#383B42",
    marginRight: 7,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#22252B",
  },

  applyButton: {
    flex: 1.4,
    height: 55,
    borderRadius: 14,
    backgroundColor: "#111318",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  applyArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    marginLeft: 10,
    marginTop: -2,
  },

  bottomHint: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 17,
    color: "#999CA4",
    paddingHorizontal: 25,
    marginBottom: 5,
  },

  // =========================
  // LOADING
  // =========================

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F7FB",
    padding: 25,
  },

  loaderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 30,
    paddingVertical: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECEEF3",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#686C75",
    fontWeight: "600",
  },

  // =========================
  // ERROR
  // =========================

  notFoundIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#F0F1F4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  notFoundIconText: {
    fontSize: 25,
    fontWeight: "800",
    color: "#555860",
  },

  errorTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#15171C",
    marginBottom: 8,
  },

  errorText: {
    fontSize: 14,
    color: "#777B84",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 22,
  },

  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#111318",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
