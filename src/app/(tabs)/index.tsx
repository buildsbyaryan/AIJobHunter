import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
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
  const [error, setError] = useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs();

      console.log("JOBS FROM SERVICE:", data);

      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET JOBS ERROR:", error);

      setJobs([]);
      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
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

  const hasJobs = filteredJobs.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>AIJobHunter</Text>

        <Text style={styles.title}>Find your{"\n"}dream job.</Text>

        <Text style={styles.subtitle}>
          Find the right jobs, manage your applications and prepare for
          interviews with AI.
        </Text>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            placeholderTextColor="#999999"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          {searchText.length > 0 && (
            <Pressable
              style={styles.clearButton}
              onPress={() => {
                setSearchText("");
                Keyboard.dismiss();
              }}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </Pressable>
          )}
        </View>

        {searchText.length > 0 && (
          <Text style={styles.searchResult}>
            {filteredJobs.length === 0
              ? "No jobs found"
              : `${filteredJobs.length} ${
                  filteredJobs.length === 1 ? "job" : "jobs"
                } found`}
          </Text>
        )}

        <Text style={styles.sectionTitle}>Recommended Jobs</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>

          <Text style={styles.errorTitle}>Something went wrong</Text>

          <Text style={styles.errorText}>{error}</Text>

          <Pressable style={styles.retryButton} onPress={loadJobs}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : hasJobs ? (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <JobCard
              id={String(item.id)}
              company={item.company}
              title={item.title}
              location={item.location}
              salary={item.salary ?? "Not specified"}
              type={item.type}
              description={item.description ?? ""}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyEmoji}>😔</Text>

          <Text style={styles.emptyTitle}>No jobs found</Text>

          <Text style={styles.emptyText}>
            Try searching for another job, company or location.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    paddingHorizontal: 28,
    paddingTop: 60,
  },

  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111111",
  },

  title: {
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 50,
    color: "#111111",
    marginTop: 45,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 25,
    color: "#666666",
    marginTop: 18,
  },

  searchContainer: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginTop: 30,
    backgroundColor: "#fafafa",
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#111111",
  },

  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eeeeee",
  },

  clearButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
  },

  searchResult: {
    marginTop: 10,
    fontSize: 14,
    color: "#666666",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111111",
    marginTop: 25,
  },

  listContent: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  loadingText: {
    marginTop: 12,
    color: "#666666",
  },

  errorEmoji: {
    fontSize: 40,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 15,
  },

  errorText: {
    textAlign: "center",
    color: "#666666",
    marginTop: 8,
    lineHeight: 22,
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#111111",
  },

  retryText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  emptyEmoji: {
    fontSize: 40,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 15,
  },

  emptyText: {
    textAlign: "center",
    color: "#666666",
    marginTop: 8,
    lineHeight: 22,
  },
});
