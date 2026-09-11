import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../services/profileService";

interface Profile {
  id: number;
  name: string;
  email: string;
}

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);

  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await getProfile();

      setProfile(data);
    } catch (error: any) {
      console.error("PROFILE ERROR:", error?.response?.data || error);

      Alert.alert("Error", "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();

          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const displayName = profile?.name || user?.name || "User";

  const displayEmail = profile?.email || user?.email || "No email";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>

          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color="#111111" />
          </Pressable>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <>
                <Text style={styles.name}>{displayName}</Text>

                <Text style={styles.email}>{displayEmail}</Text>
              </>
            )}
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() => {
              Alert.alert(
                "Coming Soon",
                "Profile editing will be available soon.",
              );
            }}
          >
            <Ionicons name="create-outline" size={19} color="#111111" />
          </Pressable>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.menuCard}>
          <ProfileMenuItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Manage your personal details"
            onPress={() => {
              Alert.alert(
                "Coming Soon",
                "Personal information editing will be available soon.",
              );
            }}
          />

          <View style={styles.divider} />

          <ProfileMenuItem
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => {
              Alert.alert(
                "Coming Soon",
                "Password change will be available soon.",
              );
            }}
          />

          <View style={styles.divider} />

          <ProfileMenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => {
              Alert.alert(
                "Coming Soon",
                "Notification settings will be available soon.",
              );
            }}
          />
        </View>

        {/* App Section */}
        <Text style={styles.sectionTitle}>App</Text>

        <View style={styles.menuCard}>
          <ProfileMenuItem
            icon="information-circle-outline"
            title="About AIJobHunter"
            subtitle="Learn more about the app"
            onPress={() => {
              Alert.alert("AIJobHunter", "AI-powered job hunting assistant.");
            }}
          />

          <View style={styles.divider} />

          <ProfileMenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help with AIJobHunter"
            onPress={() => {
              Alert.alert("Help & Support", "Support section coming soon.");
            }}
          />

          <View style={styles.divider} />

          <ProfileMenuItem
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            subtitle="Manage your privacy"
            onPress={() => {
              Alert.alert("Privacy", "Privacy settings coming soon.");
            }}
          />
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={21} color="#d32f2f" />

          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>AIJobHunter • Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function ProfileMenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: ProfileMenuItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={21} color="#111111" />
      </View>

      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>

        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={19} color="#aaaaaa" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111",
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eeeeee",
  },

  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eeeeee",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#ffffff",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111111",
  },

  email: {
    fontSize: 14,
    color: "#777777",
    marginTop: 4,
  },

  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111111",
    marginTop: 28,
    marginBottom: 12,
  },

  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eeeeee",
    overflow: "hidden",
  },

  menuItem: {
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  menuItemPressed: {
    opacity: 0.6,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
  },

  menuTextContainer: {
    flex: 1,
    marginLeft: 14,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },

  menuSubtitle: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#eeeeee",
    marginLeft: 72,
  },

  logoutButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eeeeee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    gap: 9,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#d32f2f",
  },

  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#999999",
    marginTop: 22,
  },
});
