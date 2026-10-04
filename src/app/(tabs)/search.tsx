import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import api from "@/services/api";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string | null;
  experience?: string | null;
  description?: string | null;
}

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = useCallback(async (refresh = false) => {
    try {
      setError("");

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/jobs");

      console.log("JOBS API:", response.data);

      const data = response.data?.jobs;

      setJobs(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.log("LOAD JOBS ERROR:", error.response?.data ?? error.message);

      setError(error.response?.data?.message ?? "Unable to load jobs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const filteredJobs = jobs.filter((job) => {
    const text = `
      ${job.title}
      ${job.company}
      ${job.location}
      ${job.type}
      ${job.experience ?? ""}
    `.toLowerCase();

    return text.includes(query.toLowerCase());
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />

        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.smallTitle}>AI JOB HUNTER</Text>

          <Text style={styles.title}>Find your next job</Text>
        </View>

        <View style={styles.aiIcon}>
          <Ionicons name="sparkles" size={21} color="#4F46E5" />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={21} color="#9CA3AF" />

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search jobs, skills, companies..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <View style={styles.filterActive}>
          <Text style={styles.filterActiveText}>All Jobs</Text>
        </View>

        <View style={styles.filter}>
          <Text style={styles.filterText}>Remote</Text>
        </View>

        <View style={styles.filter}>
          <Text style={styles.filterText}>Full Time</Text>
        </View>
      </View>

      {/* Result count */}
      <Text style={styles.resultText}>{filteredJobs.length} jobs found</Text>

      {/* Error */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#DC2626" />

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadJobs()}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadJobs(true)}
            />
          }
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.jobCard}
              activeOpacity={0.8}
              onPress={() => router.push(`/job/${item.id}`)}
            >
              <View style={styles.companyLogo}>
                <Text style={styles.logoText}>
                  {item.company?.charAt(0)?.toUpperCase() || "J"}
                </Text>
              </View>

              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{item.title}</Text>

                <Text style={styles.company}>{item.company}</Text>

                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />

                  <Text style={styles.metaText}>{item.location}</Text>

                  <Text style={styles.dot}>•</Text>

                  <Text style={styles.metaText}>{item.type}</Text>
                </View>

                {item.salary ? (
                  <Text style={styles.salary}>{item.salary}</Text>
                ) : null}
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={45} color="#D1D5DB" />

              <Text style={styles.emptyTitle}>No jobs found</Text>

              <Text style={styles.emptyText}>
                Try searching for another role or skill.
              </Text>
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
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  smallTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6366F1",
    letterSpacing: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
  },

  aiIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  searchBox: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#111827",
  },

  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  filterActive: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },

  filterActiveText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  filter: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  filterText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 13,
  },

  resultText: {
    marginTop: 25,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },

  jobCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF0F4",
  },

  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4F46E5",
  },

  jobInfo: {
    flex: 1,
    marginLeft: 13,
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

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  metaText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },

  dot: {
    color: "#9CA3AF",
    marginHorizontal: 6,
  },

  salary: {
    fontSize: 13,
    fontWeight: "700",
    color: "#059669",
    marginTop: 7,
  },

  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 70,
    paddingHorizontal: 20,
  },

  errorText: {
    color: "#DC2626",
    textAlign: "center",
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#374151",
    marginTop: 15,
  },

  emptyText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "center",
  },
});
