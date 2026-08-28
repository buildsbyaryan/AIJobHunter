import { Stack } from "expo-router";

import { SavedJobsProvider } from "../context/SavedJobsContext";

export default function RootLayout() {
  return (
    <SavedJobsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SavedJobsProvider>
  );
}
