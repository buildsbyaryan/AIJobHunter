import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import JobCard from "../../components/JobCard";
import { getJobs } from "../../services/jobService";
import { Job } from "../../types/job";

export default function HomeScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    try {
      setError("");

      const data = await getJobs();

      setJobs(data);
    } catch (error) {
      console.error("GET JOBS ERROR:", error);

      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const refreshJobs = async () => {
    try {
      setRefreshing(true);
      setError("");

      const data = await getJobs();

      setJobs(data);
    } catch (error) {
      console.error("REFRESH JOBS ERROR:", error);

      setError("Unable to refresh jobs.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const search = searchText.toLowerCase().trim();

    return (
      job.company.toLowerCase().includes(search) ||
      job.title.toLowerCase().includes(search) ||
      job.location.toLowerCase().includes(search) ||
      job.type.toLowerCase().includes(search)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>

          <Text style={styles.title}>Find your dream job.</Text>
        </View>

        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>A</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, companies..."
          placeholderTextColor="#999999"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()}
        />

        {searchText.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={() => setSearchText("")}
          >
            <Text style={styles.clearText}>×</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended Jobs</Text>

        <Text style={styles.jobCount}>{filteredJobs.length} Jobs</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Something went wrong</Text>

          <Text style={styles.errorText}>{error}</Text>

          <Pressable style={styles.retryButton} onPress={loadJobs}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : filteredJobs.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🔍</Text>

          <Text style={styles.emptyTitle}>No jobs found</Text>

          <Text style={styles.emptyText}>Try another keyword or location.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <JobCard
              id={String(item.id)}
              company={item.company}
              title={item.title}
              location={item.location}
              salary={item.salary ?? "Salary not specified"}
              type={item.type}
              description={item.description ?? ""}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshJobs} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingTop: 55,
  },

  header: {
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 14,
    color: "#777777",
    fontWeight: "500",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111111",
    marginTop: 8,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIconText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  searchContainer: {
    height: 54,
    marginHorizontal: 22,
    marginTop: 24,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eeeeee",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  searchIcon: {
    fontSize: 27,
    color: "#777777",
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111111",
  },

  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
  },

  clearText: {
    fontSize: 22,
    color: "#555555",
    lineHeight: 25,
  },

  sectionHeader: {
    marginHorizontal: 22,
    marginTop: 28,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  },

  jobCount: {
    fontSize: 13,
    color: "#777777",
  },

  listContent: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    color: "#777777",
    marginTop: 12,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  },

  errorText: {
    fontSize: 14,
    color: "#777777",
    marginTop: 8,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#111111",
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 20,
  },

  retryText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  emptyEmoji: {
    fontSize: 45,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 15,
  },

  emptyText: {
    color: "#777777",
    marginTop: 8,
  },
});
