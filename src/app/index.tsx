import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AIJobHunter</Text>

      <View style={styles.content}>
        <Text style={styles.title}>Find your{"\n"}dream job.</Text>

        <Text style={styles.subtitle}>
          Find the right jobs, manage your applications and prepare for
          interviews with AI.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => console.log("Start Your Journey")}
        >
          <Text style={styles.buttonText}>Start Your Journey</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
  },

  logo: {
    fontSize: 22,
    fontWeight: "700",
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 44,
    fontWeight: "800",
    lineHeight: 52,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    marginTop: 20,
    opacity: 0.6,
  },

  button: {
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#111111",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
});
