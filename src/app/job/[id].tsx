import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { jobs } from "../../data/jobs";

export default function JobDetailsScreen() {

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return (
      <View style={styles.center}>

        <Text style={styles.errorTitle}>
          Job not found
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>

      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <Pressable
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            ← Back
          </Text>
        </Pressable>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* COMPANY */}

        <Text style={styles.company}>
          {job.company}
        </Text>

        {/* TITLE */}

        <Text style={styles.title}>
          {job.title}
        </Text>

        {/* BASIC INFO */}

        <Text style={styles.info}>
          📍 {job.location}
        </Text>

        <Text style={styles.info}>
          💰 {job.salary}
        </Text>

        <Text style={styles.info}>
          💼 {job.type}
        </Text>

        {/* ABOUT */}

        <Text style={styles.sectionTitle}>
          About this job
        </Text>

        <Text style={styles.description}>
          {job.description}
        </Text>

        {/* APPLY */}

        <Pressable
          style={styles.applyButton}
          onPress={() => {
            console.log(
              "Apply clicked:",
              job.id
            );
          }}
        >
          <Text style={styles.applyButtonText}>
            Apply Now
          </Text>
        </Pressable>

      </ScrollView>

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

  content: {
    padding: 24,
    paddingBottom: 50,
  },

  company: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    marginTop: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111111",
    marginTop: 10,
    lineHeight: 40,
  },

  info: {
    fontSize: 16,
    color: "#555555",
    marginTop: 15,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111111",
    marginTop: 35,
  },

  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#666666",
    marginTop: 12,
  },

  applyButton: {
    marginTop: 35,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#111111",
    alignItems: "center",
  },

  applyButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  backButton: {
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: "#111111",
    borderRadius: 10,
  },

  backButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },

});