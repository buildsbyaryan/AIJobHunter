import { AuthProvider } from "@/context/AuthContext";
import { SavedJobsProvider } from "@/context/SavedJobsContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SavedJobsProvider>
    </AuthProvider>
  );
}
