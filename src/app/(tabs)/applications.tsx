import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";

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

type ApplicationStatus = "applied" | "interview" | "selected" | "rejected";

interface Application {
  id: string | number;
  jobId: string | number;
  status: ApplicationStatus | string;
  appliedAt?: string;
  job?: {
    id: string | number;
    title: string;
    company: string;
    location?: string | null;
  } | null;
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  interview: "Interview",
  selected: "Selected",
  rejected: "Rejected",
};

export default function ApplicationsScreen() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Load applications from backend
  const loadApplications = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await api.get("/applications");

      // Expected API response:
      // { message: "...", applications: [...], count: 1 }
      const data = response.data?.applications;

      setApplications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.log(
        "LOAD APPLICATIONS ERROR:",
        err.response?.data ?? err.message,
      );

      setError(
        err.response?.data?.message ??
          "Unable to load applications. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload whenever this screen gets focus
  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, [loadApplications]),
  );

  // Normalize status received from backend
  const normalizeStatus = (status?: string): ApplicationStatus => {
    const normalized = status?.toLowerCase();

    if (
      normalized === "applied" ||
      normalized === "interview" ||
      normalized === "selected" ||
      normalized === "rejected"
    ) {
      return normalized;
    }

    return "applied";
  };

  // Status badge color
  const getStatusStyle = (status: ApplicationStatus) => {
    switch (status) {
      case "interview":
        return styles.interviewBadge;

      case "selected":
        return styles.selectedBadge;

      case "rejected":
        return styles.rejectedBadge;

      default:
        return styles.appliedBadge;
    }
  };

  // Format application date
  const formatDate = (date?: string) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Application card
  const renderApplication = ({ item }: { item: Application }) => {
    const status = normalizeStatus(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>
              {item.job?.title ?? "Job title unavailable"}
            </Text>

            <Text style={styles.company}>
              {item.job?.company ?? "Company unavailable"}
            </Text>
          </View>

          <View style={[styles.badge, getStatusStyle(status)]}>
            <Text style={styles.badgeText}>{STATUS_LABELS[status]}</Text>
          </View>
        </View>

        {item.job?.location ? (
          <Text style={styles.location}>
            {"📍"} {item.job.location}
          </Text>
        ) : null}

        <View style={styles.divider} />

        <Text style={styles.date}>
          Applied on: {formatDate(item.appliedAt)}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.applicationId}>Application #{item.id}</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.viewButton}
            onPress={() => {
              router.push(`/job/${String(item.jobId)}` as any);
            }}
          >
            <Text style={styles.viewButtonText}>View Job</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />

        <Text style={styles.helperText}>Loading applications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>My Applications</Text>

          <Text style={styles.subtitle}>
            Track your job application progress
          </Text>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryLabel}>Total Applications</Text>

          <Text style={styles.summarySubtitle}>
            Keep track of your job search
          </Text>
        </View>

        <Text style={styles.summaryCount}>{applications.length}</Text>
      </View>

      {/* Error state */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>

          <Text style={styles.errorTitle}>Something went wrong</Text>

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={() => loadApplications()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderApplication}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            applications.length === 0 ? styles.emptyList : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadApplications(true)}
              colors={["#2563EB"]}
              tintColor="#2563EB"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>

              <Text style={styles.emptyTitle}>No Applications Yet</Text>

              <Text style={styles.emptyDescription}>
                Explore available jobs and apply to start tracking your
                applications here.
              </Text>

              <TouchableOpacity
                style={styles.browseButton}
                activeOpacity={0.8}
                onPress={() => router.push("/(tabs)" as any)}
              >
                <Text style={styles.browseButtonText}>Explore Jobs</Text>
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
    backgroundColor: "#F5F7FB",
    paddingTop: 52,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  backButtonText: {
    fontSize: 32,
    lineHeight: 36,
    color: "#0F172A",
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },

  summary: {
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#1D4ED8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  summarySubtitle: {
    fontSize: 12,
    color: "#DBEAFE",
    marginTop: 5,
  },

  summaryCount: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  list: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },

  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  jobInfo: {
    flex: 1,
  },

  jobTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },

  company: {
    fontSize: 14,
    color: "#475569",
    marginTop: 6,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  appliedBadge: {
    backgroundColor: "#DBEAFE",
  },

  interviewBadge: {
    backgroundColor: "#FEF3C7",
  },

  selectedBadge: {
    backgroundColor: "#DCFCE7",
  },

  rejectedBadge: {
    backgroundColor: "#FEE2E2",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },

  location: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
  },

  date: {
    fontSize: 12,
    color: "#64748B",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },

  applicationId: {
    fontSize: 11,
    color: "#94A3B8",
    flex: 1,
  },

  viewButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "#EFF6FF",
  },

  viewButtonText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
    padding: 24,
  },

  helperText: {
    color: "#64748B",
    marginTop: 12,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  emptyIcon: {
    fontSize: 44,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  emptyDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 22,
  },

  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#2563EB",
  },

  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  errorContainer: {
    margin: 18,
    padding: 22,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  errorIcon: {
    fontSize: 30,
    marginBottom: 10,
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  errorText: {
    color: "#B91C1C",
    textAlign: "center",
    lineHeight: 21,
  },

  retryButton: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#1D4ED8",
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
