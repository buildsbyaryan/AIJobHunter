import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  experience?: string;
  salary?: string;
  jobType?: string;
  description?: string;
  requirements?: string;
  skills?: string[];
  createdAt?: string;
}

interface SavedJobsContextType {
  savedJobs: Job[];
  saveJob: (job: Job) => Promise<void>;
  removeSavedJob: (jobId: number) => Promise<void>;
  isSaved: (jobId: number) => boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "saved_jobs";

interface Props {
  children: ReactNode;
}

export function SavedJobsProvider({ children }: Props) {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved jobs
  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        const parsedData = JSON.parse(data);

        if (Array.isArray(parsedData)) {
          setSavedJobs(parsedData);
        }
      }
    } catch (error) {
      console.log("LOAD SAVED JOBS ERROR:", error);
    } finally {
      setLoaded(true);
    }
  };

  // Save jobs to AsyncStorage
  const persistJobs = async (jobs: Job[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (error) {
      console.log("PERSIST SAVED JOBS ERROR:", error);
    }
  };

  // Save Job
  const saveJob = async (job: Job) => {
    try {
      setSavedJobs((currentJobs) => {
        const alreadySaved = currentJobs.some((item) => item.id === job.id);

        if (alreadySaved) {
          return currentJobs;
        }

        const updatedJobs = [job, ...currentJobs];

        persistJobs(updatedJobs);

        return updatedJobs;
      });
    } catch (error) {
      console.log("SAVE JOB ERROR:", error);
      throw error;
    }
  };

  // Remove Saved Job
  const removeSavedJob = async (jobId: number) => {
    try {
      setSavedJobs((currentJobs) => {
        const updatedJobs = currentJobs.filter((job) => job.id !== jobId);

        persistJobs(updatedJobs);

        return updatedJobs;
      });
    } catch (error) {
      console.log("REMOVE SAVED JOB ERROR:", error);
      throw error;
    }
  };

  // Check if Job is Saved
  const isSaved = (jobId: number) => {
    return savedJobs.some((job) => job.id === jobId);
  };

  // Provider load hone tak children render kar sakte hain,
  // but savedJobs initially [] rahega.
  if (!loaded) {
    return (
      <SavedJobsContext.Provider
        value={{
          savedJobs: [],
          saveJob,
          removeSavedJob,
          isSaved,
        }}
      >
        {children}
      </SavedJobsContext.Provider>
    );
  }

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        saveJob,
        removeSavedJob,
        isSaved,
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);

  if (!context) {
    throw new Error("useSavedJobs must be used inside SavedJobsProvider");
  }

  return context;
}
