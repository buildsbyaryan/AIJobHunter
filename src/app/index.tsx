import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* LOGO */}

        <View>
          <Text style={styles.logo}>AIJobHunter</Text>

          <Text style={styles.badge}>AI POWERED JOB SEARCH</Text>
        </View>

        {/* HERO */}

        <View style={styles.hero}>
          <Text style={styles.title}>
            Find your{"\n"}
            dream job.
          </Text>

          <Text style={styles.description}>
            Discover the right opportunities, manage your applications and
            prepare for interviews with AI.
          </Text>
        </View>

        {/* BUTTONS */}

        <View style={styles.actions}>
          <Pressable
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginText}>Login</Text>
          </Pressable>

          <Pressable
            style={styles.registerButton}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.registerText}>Create Account</Text>
          </Pressable>
        </View>

        {/* FOOTER */}

        <Text style={styles.footer}>Your next opportunity starts here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 25,
    justifyContent: "space-between",
  },

  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111111",
  },

  badge: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#777777",
  },

  hero: {
    marginTop: 80,
  },

  title: {
    fontSize: 48,
    lineHeight: 55,
    fontWeight: "900",
    color: "#111111",
  },

  description: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 25,
    color: "#666666",
    maxWidth: 340,
  },

  actions: {
    marginTop: 50,
  },

  loginButton: {
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },

  loginText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  registerButton: {
    height: 56,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dddddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  registerText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    fontSize: 13,
    color: "#999999",
  },
});
