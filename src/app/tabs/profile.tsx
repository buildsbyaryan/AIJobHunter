import { useMemo, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ProfileInput from "../../components/ProfileInput";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");

  const completion = useMemo(() => {
    const fields = [name, email, role, location, skills];

    const completedFields = fields.filter(
      (field) => field.trim().length > 0,
    ).length;

    return Math.round((completedFields / fields.length) * 100);
  }, [name, email, role, location, skills]);

  const handleSaveProfile = () => {
    if (!name.trim()) {
      Alert.alert("Missing Information", "Please enter your full name.");

      return;
    }

    if (!email.trim()) {
      Alert.alert("Missing Information", "Please enter your email.");

      return;
    }

    Alert.alert("Profile Saved", "Your profile has been updated successfully.");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.trim() ? name.trim().charAt(0).toUpperCase() : "👤"}
            </Text>
          </View>

          <Text style={styles.title}>
            {name.trim() ? name : "Your Profile"}
          </Text>

          <Text style={styles.subtitle}>
            Build your profile to get better job recommendations.
          </Text>
        </View>

        {/* COMPLETION */}

        <View style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionTitle}>Profile Completion</Text>

            <Text style={styles.completionPercentage}>{completion}%</Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${completion}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* FORM */}

        <View style={styles.form}>
          <ProfileInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <ProfileInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ProfileInput
            label="Preferred Job Role"
            placeholder="e.g. React Native Developer"
            value={role}
            onChangeText={setRole}
          />

          <ProfileInput
            label="Location"
            placeholder="e.g. Panipat, Haryana"
            value={location}
            onChangeText={setLocation}
          />

          <ProfileInput
            label="Skills"
            placeholder="e.g. React Native, JavaScript, TypeScript"
            value={skills}
            onChangeText={setSkills}
          />

          {/* SAVE BUTTON */}

          <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </Pressable>
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
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 50,
  },

  header: {
    alignItems: "center",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eeeeee",
  },

  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111111",
  },

  title: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#666666",
    textAlign: "center",
  },

  completionCard: {
    marginTop: 30,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
  },

  completionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  completionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },

  completionPercentage: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111111",
  },

  progressBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#dddddd",
    marginTop: 12,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#111111",
  },

  form: {
    marginTop: 10,
  },

  saveButton: {
    height: 54,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    marginTop: 30,
  },

  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
