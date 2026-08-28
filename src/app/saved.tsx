import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";

import { useSavedJobs } from "../context/SavedJobsContext";

import JobCard from "../components/JobCard";

export default function SavedScreen() {
  const { savedJobs } = useSavedJobs();

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Saved Jobs</Text>

        <Text style={styles.count}>
          {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved
        </Text>
      </View>

      {/* EMPTY */}

      {savedJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>❤️</Text>

          <Text style={styles.emptyTitle}>No saved jobs</Text>

          <Text style={styles.emptyText}>
            Save jobs you're interested in and they will appear here.
          </Text>

          <Pressable
            style={styles.exploreButton}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.exploreButtonText}>Explore Jobs</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
        />
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
    paddingTop: 60,
    paddingHorizontal: 24,
  },

  back: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111111",
    marginTop: 30,
  },

  count: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
  },

  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  emptyEmoji: {
    fontSize: 45,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 15,
  },

  emptyText: {
    textAlign: "center",
    color: "#666666",
    lineHeight: 22,
    marginTop: 10,
  },

  exploreButton: {
    marginTop: 25,
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#111111",
  },

  exploreButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
