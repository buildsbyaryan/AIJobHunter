import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import api from "@/services/api";
import { getToken } from "@/services/authStorage";

const getUserIdFromToken = (token: string): number | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    const decoded = atob(padded);
    const parsed = JSON.parse(decoded);

    return Number(parsed.userId ?? parsed.sub ?? parsed.id ?? null);
  } catch {
    return null;
  }
};

interface SavedJob {
  id: number;
  userId: number;
  jobId: number;
  createdAt?: string;

  job?: {
    id: number;
    title: string;
    company: string;
    location: string;
    type?: string;
    salary?: string | null;
    experience?: string;
    description?: string;
  };
}

export default function SavedScreen() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadSavedJobs = useCallback(async (refresh = false) => {
    try {
      setError("");

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = await getToken();
      const userId = token ? getUserIdFromToken(token) : null;

      console.log("=================================");
      console.log("FETCHING SAVED JOBS");
      console.log("USER ID:", userId);
      console.log("=================================");

      if (!userId) {
        setSavedJobs([]);
        setError("User ID not found. Please login again.");
        return;
      }

      const response = await api.get("/saved-jobs");

      console.log("STATUS:", response.status);
      console.log("FULL RESPONSE:", response.data);

      // API directly returns an array
      const data = response.data;

      if (!Array.isArray(data)) {
        console.log("INVALID SAVED JOB RESPONSE");
        setSavedJobs([]);
        return;
      }

      // Only current user's saved jobs
      const currentUserSavedJobs = data.filter(
        (item: SavedJob) => Number(item.userId) === Number(userId) && item.job,
      );

      console.log("CURRENT USER SAVED JOBS:", currentUserSavedJobs);

      console.log("TOTAL SAVED JOBS:", currentUserSavedJobs.length);

      setSavedJobs(currentUserSavedJobs);
    } catch (error: any) {
      console.log("=================================");
      console.log("LOAD SAVED JOBS ERROR");
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("MESSAGE:", error.message);
      console.log("=================================");

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load saved jobs.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />

        <Text style={styles.loadingText}>Loading saved jobs...</Text>
      </View>
    );
  }

  // =========================
  // Main Screen
  // =========================

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>YOUR COLLECTION</Text>

          <Text style={styles.title}>Saved Jobs</Text>
        </View>

        <View style={styles.countBox}>
          <Text style={styles.count}>{savedJobs.length}</Text>
        </View>
      </View>

      <Text style={styles.description}>Jobs you've saved for later.</Text>

      {/* Error */}
      {error ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle-outline" size={38} color="#DC2626" />
          </View>

          <Text style={styles.errorTitle}>Something went wrong</Text>

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.85}
            onPress={() => loadSavedJobs()}
          >
            <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />

            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadSavedJobs(true)}
              colors={["#4F46E5"]}
              tintColor="#4F46E5"
            />
          }
          contentContainerStyle={[
            styles.listContent,
            savedJobs.length === 0 && styles.emptyListContent,
          ]}
          renderItem={({ item }) => {
            const job = item.job;

            if (!job) {
              return null;
            }

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.88}
                onPress={() => router.push(`/job/${job.id}`)}
              >
                {/* Company Logo */}
                <View style={styles.logo}>
                  <Text style={styles.logoText}>
                    {job.company?.charAt(0)?.toUpperCase() || "J"}
                  </Text>
                </View>

                {/* Job Information */}
                <View style={styles.info}>
                  <Text style={styles.jobTitle} numberOfLines={1}>
                    {job.title}
                  </Text>

                  <Text style={styles.company} numberOfLines={1}>
                    {job.company}
                  </Text>

                  {/* Location */}
                  <View style={styles.locationRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#6B7280"
                    />

                    <Text style={styles.location} numberOfLines={1}>
                      {job.location}
                    </Text>
                  </View>

                  {/* Salary */}
                  {job.salary ? (
                    <Text style={styles.salary}>{job.salary}</Text>
                  ) : null}

                  {/* Job Type */}
                  {job.type ? (
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeText}>{job.type}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Bookmark */}
                <View style={styles.bookmarkButton}>
                  <Ionicons name="bookmark" size={21} color="#4F46E5" />
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="bookmark-outline" size={40} color="#6366F1" />
              </View>

              <Text style={styles.emptyTitle}>No saved jobs</Text>

              <Text style={styles.emptyText}>
                Save interesting jobs and come back to them later.
              </Text>

              <TouchableOpacity
                style={styles.browseButton}
                activeOpacity={0.85}
                onPress={() => router.push("/search")}
              >
                <Ionicons name="search-outline" size={18} color="#FFFFFF" />

                <Text style={styles.browseText}>Browse Jobs</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
  },

  // =========================
  // Header
  // =========================

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  subtitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6366F1",
    letterSpacing: 1,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#111827",
    marginTop: 5,
  },

  countBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  count: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4F46E5",
  },

  description: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 8,
  },

  // =========================
  // List
  // =========================

  listContent: {
    paddingTop: 22,
    paddingBottom: 30,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  // =========================
  // Job Card
  // =========================

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#EEF0F4",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4F46E5",
  },

  info: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  jobTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  company: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  location: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },

  salary: {
    color: "#059669",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },

  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 7,
  },

  typeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
  },

  bookmarkButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  // =========================
  // Empty
  // =========================

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginTop: 18,
  },

  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },

  browseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 13,
    marginTop: 20,
  },

  browseText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  // =========================
  // Error
  // =========================

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  errorIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginTop: 15,
  },

  errorText: {
    color: "#DC2626",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 18,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
