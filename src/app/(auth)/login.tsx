import { useState } from "react";

import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";

import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import Input from "../../components/Input";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>AIJobHunter</Text>

        <Text style={styles.title}>Welcome{"\n"}back.</Text>

        <Text style={styles.subtitle}>
          Login to continue finding your dream job.
        </Text>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showPassword}>
              {showPassword ? "Hide Password" : "Show Password"}
            </Text>
          </Pressable>

          {error ? <ErrorMessage message={error} /> : null}

          <View style={styles.button}>
            <Button title="Login" onPress={handleLogin} />
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account?</Text>

            <Pressable onPress={() => router.push("/register")}>
              <Text style={styles.registerLink}>Register</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 70,
    paddingBottom: 40,
  },

  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111111",
  },

  title: {
    marginTop: 45,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "800",
    color: "#111111",
  },

  subtitle: {
    marginTop: 15,
    fontSize: 15,
    lineHeight: 23,
    color: "#666666",
  },

  form: {
    marginTop: 20,
  },

  showPassword: {
    marginTop: 10,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "600",
    color: "#111111",
  },

  button: {
    marginTop: 25,
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  registerText: {
    color: "#666666",
    fontSize: 14,
  },

  registerLink: {
    marginLeft: 5,
    color: "#111111",
    fontSize: 14,
    fontWeight: "800",
  },
});
