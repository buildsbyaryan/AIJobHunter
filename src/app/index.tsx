import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Text style={styles.logo}>AIJobHunter</Text>

      <View style={styles.welcomeSection}>
        <Text style={styles.title}>
          Find your{"\n"}
          dream job.
        </Text>
        <Text style={styles.subtitle}>
          Find the right jobs, manage your applications and prepare for
          interviews with AI.
        </Text>
        <Pressable
          style={styles.startButton}
          onPress={() => console.log("Start Your Journey pressed")}
        >
          {" "}
          <Text style={styles.startButtonText}>Start Your Journey</Text>
        </Pressable>
      </View>
      {/* Job Card */}
      <View style={styles.jobCard}>
        <Text style={styles.company}>Google</Text>
        <Text style={styles.jobTitle}>Software Engineer</Text>
        <Text style={styles.location}>📍 Bangalore</Text>
        <Text style={styles.salary}>₹8–15 LPA</Text>
        <Pressable
          style={styles.viewButton}
          onPress={() => console.log("View Job pressed")}
        >
          <Text style={styles.viewButtonText}>View Job</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
    paddingTop: 60,
  },
  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111111",
  },
  welcomeSection: {
    marginTop: 70,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 50,
    color: "#111111",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 25,
    color: "#666666",
    marginTop: 18,
  },
  startButton: {
    backgroundColor: "#111111",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 30,
  },

  startButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  jobCard: {
    marginTop: 35,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
  },
  company: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "600",
  },

  jobTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111111",
    marginTop: 6,
  },

  location: {
    fontSize: 15,
    color: "#666666",
    marginTop: 12,
  },

  salary: {
    fontSize: 15,
    color: "#111111",
    fontWeight: "600",
    marginTop: 8,
  },

  viewButton: {
    marginTop: 18,
    backgroundColor: "#111111",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  viewButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
