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

import JobCard from "../components/JobCard";

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");

  const jobs = [
    {
      id: "1",
      company: "Google",
      title: "Software Engineer",
      location: "Bangalore",
      salary: "₹8–15 LPA",
    },
    {
      id: "2",
      company: "Microsoft",
      title: "Frontend Developer",
      location: "Hyderabad",
      salary: "₹10–18 LPA",
    },
    {
      id: "3",
      company: "Amazon",
      title: "Backend Developer",
      location: "Gurgaon",
      salary: "₹12–20 LPA",
    },
    {
      id: "4",
      company: "TCS",
      title: "Java Developer",
      location: "Pune",
      salary: "₹5–9 LPA",
    },
    {
      id: "5",
      company: "Infosys",
      title: "React Native Developer",
      location: "Noida",
      salary: "₹6–10 LPA",
    },
  ];

  // FILTER JOBS
  const filteredJobs = jobs.filter((job) => {
    const search = searchText.toLowerCase();

    return (
      job.company.toLowerCase().includes(search) ||
      job.title.toLowerCase().includes(search) ||
      job.location.toLowerCase().includes(search)
    );
  });

  return (
    <View style={styles.container}>
      {/* Header */}
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

        {/* Search */}
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

        {/* SEARCH RESULT */}

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

      {/* Jobs */}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            company={item.company}
            title={item.title}
            location={item.location}
            salary={item.salary}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.noJobs}>No jobs found 😔</Text>}
      />
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
    marginTop: 25,
    color: "#111111",
  },

  listContent: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  noJobs: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666666",
  },
});
