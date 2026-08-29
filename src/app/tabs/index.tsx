import { useState } from "react";

import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import JobCard from "../../components/JobCard";

import { router } from "expo-router";
import { jobs } from "../../data/jobs";

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");

  /*
   * SEARCH JOBS
   */

  const filteredJobs = jobs.filter((job) => {
    const search = searchText.toLowerCase().trim();

    return (
      job.company.toLowerCase().includes(search) ||
      job.title.toLowerCase().includes(search) ||
      job.location.toLowerCase().includes(search) ||
      job.type.toLowerCase().includes(search)
    );
  });

  /*
   * CHECK IF JOBS EXIST
   */

  const hasJobs = filteredJobs.length > 0;

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.logo}>AIJobHunter</Text>


        <Text style={styles.title}>
          Find your{"\n"}
          dream job.
        </Text>

        <Text style={styles.subtitle}>
          Find the right jobs, manage your applications and prepare for
          interviews with AI.
        </Text>

        {/* SEARCH */}

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

        {/* RESULT */}

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

      {/* JOB LIST */}

      {hasJobs ? (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              id={item.id}
              company={item.company}
              title={item.title}
              location={item.location}
              salary={item.salary}
              type={item.type}
              description={item.description}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
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

  savedJobsButton: {
    alignSelf: "flex-start",
    marginTop: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#111111",
  },

  savedJobsButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
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

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
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
