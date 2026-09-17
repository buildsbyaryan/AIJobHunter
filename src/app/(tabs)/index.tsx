import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDebounce } from "../../hooks/useDebounce";

import ErrorMessage from "../../components/ErrorMessage";
import JobCard from "../../components/JobCard";
import JobFilters from "../../components/JobFilters";
import SearchBar from "../../components/SearchBar";
import { getJobs } from "../../services/jobService";
import { Job } from "../../types/job";

export default function HomeScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [location, setLocation] = useState("All");
  const [experience, setExperience] = useState("All");
  const [type, setType] = useState("All");
  const [salary, setSalary] = useState("All");

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await getJobs({
          search: debouncedSearch.trim() || undefined,

          location: location !== "All" ? location : undefined,

          experience: experience !== "All" ? experience : undefined,

          type: type !== "All" ? type : undefined,

          salary: salary !== "All" ? salary : undefined,
        });

        setJobs(data);
      } catch (err: any) {
        console.error("LOAD JOBS ERROR:", err);

        setError(err?.response?.data?.message || "Unable to load jobs");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [debouncedSearch, location, experience, type, salary],
  );

  useEffect(() => {
    loadJobs();
  }, [debouncedSearch, location, experience, type, salary]);

  const clearFilters = () => {
    setSearch("");
    setLocation("All");
    setExperience("All");
    setType("All");
    setSalary("All");
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Find Your Dream Job</Text>

      <Text style={styles.subtitle}>
        Search opportunities that match your skills.
      </Text>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        onSubmit={() => loadJobs()}
      />

      <JobFilters
        location={location}
        experience={experience}
        type={type}
        salary={salary}
        setLocation={setLocation}
        setExperience={setExperience}
        setType={setType}
        setSalary={setSalary}
      />

      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>{jobs.length} Jobs Found</Text>

        <Text style={styles.clearButton} onPress={clearFilters}>
          Clear Filters
        </Text>
      </View>
    </View>
  );

  if (loading && jobs.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111" />

        <Text style={styles.loadingText}>Searching jobs...</Text>
      </View>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <View style={styles.center}>
        <ErrorMessage message={error} />

        <Text style={styles.retry} onPress={() => loadJobs()}>
          Try Again
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <JobCard job={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Jobs Found</Text>

            <Text style={styles.emptyText}>
              Try changing your search or filters.
            </Text>
          </View>
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadJobs(true)}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  header: {
    marginBottom: 10,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#777777",
    marginBottom: 20,
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },

  resultTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111111",
  },

  clearButton: {
    fontSize: 13,
    fontWeight: "600",
    color: "#d62828",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    color: "#777",
  },

  retry: {
    marginTop: 15,
    color: "#111",
    fontWeight: "700",
  },

  empty: {
    alignItems: "center",
    paddingVertical: 50,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  emptyText: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
  },
});
