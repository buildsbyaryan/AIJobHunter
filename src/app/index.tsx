import { Pressable, StyleSheet, Text, View } from "react-native";
import JobCard from "../components/JobCard";

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
      <JobCard
        company="Google"
        title="Software Engineer"
        location="Bangalore"
        salary="₹8–15 LPA"
      />
      <JobCard
        company="Microsoft"
        title="Frontend Developer"
        location="Hyderabad"
        salary="₹10–18 LPA"
      />
      <JobCard
        company="Amazon"
        title="Backend Developer"
        location="Gurgaon"
        salary="₹12–20 LPA"
      />
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
});
