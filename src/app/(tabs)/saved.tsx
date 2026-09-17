import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const savedJobs = [
  {
    id: "1",
    title: "Flutter Developer",
    company: "TechNova",
    location: "Remote",
    salary: "₹6–10 LPA",
  },
  {
    id: "2",
    title: "Java Backend Developer",
    company: "CloudWorks",
    location: "Hyderabad",
    salary: "₹8–14 LPA",
  },
];

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>YOUR COLLECTION</Text>
          <Text style={styles.title}>Saved Jobs</Text>
        </View>

        <View style={styles.countBox}>
          <Text style={styles.count}>{savedJobs.length}</Text>
        </View>
      </View>

      <Text style={styles.description}>Jobs you've saved for later.</Text>

      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 22,
          paddingBottom: 30,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push(`/job/${item.id}`)}
          >
            <View style={styles.logo}>
              <Text style={styles.logoText}>{item.company.charAt(0)}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.jobTitle}>{item.title}</Text>

              <Text style={styles.company}>{item.company}</Text>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#6B7280" />

                <Text style={styles.location}>{item.location}</Text>
              </View>

              <Text style={styles.salary}>{item.salary}</Text>
            </View>

            <Ionicons name="bookmark" size={22} color="#4F46E5" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bookmark-outline" size={38} color="#6366F1" />
            </View>

            <Text style={styles.emptyTitle}>No saved jobs</Text>

            <Text style={styles.emptyText}>
              Save interesting jobs and come back to them later.
            </Text>

            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push("/search")}
            >
              <Text style={styles.browseText}>Browse Jobs</Text>
            </TouchableOpacity>
          </View>
        }
      />
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  subtitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6366F1",
    letterSpacing: 1,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#111827",
    marginTop: 5,
  },

  countBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  count: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4F46E5",
  },

  description: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF0F4",
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4F46E5",
  },

  info: {
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

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  location: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },

  salary: {
    color: "#059669",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },

  empty: {
    alignItems: "center",
    marginTop: 110,
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginTop: 18,
  },

  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },

  browseButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 13,
    marginTop: 20,
  },

  browseText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
