import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface JobCardProps {
  id: string;
  company: string;
  title: string;
  location: string;
  salary: string;
  type: string;
  description?: string;
}

export default function JobCard({
  id,
  company,
  title,
  location,
  salary,
  type,
  description,
}: JobCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/job/${id}`)}
    >
      <View style={styles.topRow}>
        <View style={styles.companyIcon}>
          <Text style={styles.companyLetter}>
            {company.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.company} numberOfLines={1}>
            {company}
          </Text>

          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>

        <Ionicons name="bookmark-outline" size={21} color="#999999" />
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Ionicons name="location-outline" size={16} color="#777777" />
          <Text style={styles.detailText} numberOfLines={1}>
            {location}
          </Text>
        </View>

        <View style={styles.detail}>
          <Ionicons name="briefcase-outline" size={16} color="#777777" />
          <Text style={styles.detailText}>{type}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.salary}>{salary || "Salary not specified"}</Text>

        <Text style={styles.viewText}>View Details →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eeeeee",
  },

  pressed: {
    opacity: 0.7,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  companyIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  companyLetter: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },

  titleContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  company: {
    fontSize: 13,
    color: "#777777",
    fontWeight: "600",
  },

  title: {
    fontSize: 17,
    color: "#111111",
    fontWeight: "800",
    marginTop: 5,
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginTop: 18,
  },

  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 1,
  },

  detailText: {
    fontSize: 13,
    color: "#777777",
    flexShrink: 1,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
  },

  salary: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
    flex: 1,
  },

  viewText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
  },
});
