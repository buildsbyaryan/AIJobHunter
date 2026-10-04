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
  id: string;
  jobId: string | number;
  status: ApplicationStatus;
  appliedAt: string;
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

  const loadApplications = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await api.get("/applications");
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

  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, [loadApplications]),
  );

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
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

  const getStatusLabel = (status: string) => {
    const normalized = status.toLowerCase() as ApplicationStatus;
    return STATUS_LABELS[normalized] ?? status;
  };

  const renderApplication = ({ item }: { item: Application }) => (
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

        <View style={[styles.badge, getStatusStyle(item.status)]}>
          <Text style={styles.badgeText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      {item.job?.location ? (
        <Text style={styles.location}>
          {"\u{1F4CD}"} {item.job.location}
        </Text>
      ) : null}

      <View style={styles.divider} />

      <Text style={styles.date}>
        Applied on:{" "}
        {item.appliedAt && !Number.isNaN(Date.parse(item.appliedAt))
          ? new Date(item.appliedAt).toLocaleDateString()
          : "Date unavailable"}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.applicationId}>Application #{item.id}</Text>

        <TouchableOpacity
          onPress={() => router.push(`/job/${String(item.jobId)}` as any)}
          style={styles.viewButton}
        >
          <Text style={styles.viewButtonText}>View Job</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
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

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Total Applications</Text>
        <Text style={styles.summaryCount}>{applications.length}</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
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
          contentContainerStyle={
            applications.length === 0 ? styles.emptyList : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadApplications(true)}
              colors={["#2563EB"]}
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
    fontWeight: "600",
    color: "#FFFFFF",
  },
  summaryCount: {
    fontSize: 28,
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
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
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
