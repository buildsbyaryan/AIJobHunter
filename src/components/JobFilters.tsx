import { ScrollView, StyleSheet, Text, View } from "react-native";
import FilterChip from "./FilterChip";

interface JobFiltersProps {
  location: string;
  experience: string;
  type: string;
  salary: string;

  setLocation: (value: string) => void;
  setExperience: (value: string) => void;
  setType: (value: string) => void;
  setSalary: (value: string) => void;
}

export default function JobFilters({
  location,
  experience,
  type,
  salary,
  setLocation,
  setExperience,
  setType,
  setSalary,
}: JobFiltersProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Location</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["All", "Delhi", "Gurgaon", "Noida", "Mumbai", "Bangalore"].map(
          (item) => (
            <FilterChip
              key={item}
              label={item}
              selected={location === item}
              onPress={() => setLocation(item)}
            />
          ),
        )}
      </ScrollView>

      <Text style={styles.heading}>Experience</Text>

      <View style={styles.wrap}>
        {["All", "0-2", "2-4", "4-6", "6+"].map((item) => (
          <FilterChip
            key={item}
            label={item === "All" ? "All" : `${item} years`}
            selected={experience === item}
            onPress={() => setExperience(item)}
          />
        ))}
      </View>

      <Text style={styles.heading}>Job Type</Text>

      <View style={styles.wrap}>
        {["All", "Full-time", "Part-time", "Internship", "Remote"].map(
          (item) => (
            <FilterChip
              key={item}
              label={item}
              selected={type === item}
              onPress={() => setType(item)}
            />
          ),
        )}
      </View>

      <Text style={styles.heading}>Salary</Text>

      <View style={styles.wrap}>
        {["All", "0-3", "3-5", "5+"].map((item) => (
          <FilterChip
            key={item}
            label={item === "All" ? "All" : `${item} LPA`}
            selected={salary === item}
            onPress={() => setSalary(item)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  heading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 8,
    marginBottom: 10,
  },

  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
