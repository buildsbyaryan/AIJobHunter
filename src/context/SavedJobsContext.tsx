import { createContext, ReactNode, useContext, useState } from "react";

import { Job } from "../types/job";

interface SavedJobsContextType {
  savedJobs: Job[];

  addSavedJob: (job: Job) => void;

  removeSavedJob: (jobId: string) => void;

  isJobSaved: (jobId: string) => boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | null>(null);

interface SavedJobsProviderProps {
  children: ReactNode;
}

export function SavedJobsProvider({ children }: SavedJobsProviderProps) {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const addSavedJob = (job: Job) => {
    setSavedJobs((previousJobs) => {
      const alreadySaved = previousJobs.some((item) => item.id === job.id);

      if (alreadySaved) {
        return previousJobs;
      }

      return [...previousJobs, job];
    });
  };

  const removeSavedJob = (jobId: string) => {
    setSavedJobs((previousJobs) =>
      previousJobs.filter((item) => item.id !== jobId),
    );
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.some((item) => item.id === jobId);
  };

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        addSavedJob,
        removeSavedJob,
        isJobSaved,
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);

  if (context === null) {
    throw new Error("useSavedJobs must be used inside SavedJobsProvider");
  }

  return context;
}
