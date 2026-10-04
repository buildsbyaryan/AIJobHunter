import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "@/services/api";
import { getUserId } from "@/services/authStorage";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  experience?: string;
  salary?: string;
  jobType?: string;
  type?: string;
  description?: string;
  requirements?: string;
  skills?: string[];
  createdAt?: string;
}

export interface SavedJob {
  id: number;
  userId: number;
  jobId: number;
  createdAt?: string;
  job?: Job;
}

interface SavedJobsContextType {
  savedJobs: Job[];

  saveJob: (job: Job) => Promise<void>;

  removeSavedJob: (jobId: number) => Promise<void>;

  isSaved: (jobId: number) => boolean;

  refreshSavedJobs: () => Promise<void>;

  loading: boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(
  undefined,
);

interface Props {
  children: ReactNode;
}

export function SavedJobsProvider({ children }: Props) {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // GET SAVED JOBS
  // =========================

  const loadSavedJobs = async () => {
    try {
      setLoading(true);

      const userId = await getUserId();

      console.log("=================================");

      console.log("GET SAVED JOBS");

      console.log("USER ID:", userId);

      console.log("=================================");

      if (!userId) {
        console.log("USER ID NOT FOUND");

        setSavedJobs([]);

        return;
      }

      const response = await api.get("/saved-jobs");

      console.log("GET SAVED JOBS STATUS:", response.status);

      console.log("GET SAVED JOBS RESPONSE:", response.data);

      // Backend directly returns array
      const data = response.data;

      if (!Array.isArray(data)) {
        console.log("INVALID SAVED JOBS RESPONSE");

        setSavedJobs([]);

        return;
      }

      // Current user's saved jobs
      const currentUserSavedJobs = data.filter(
        (item: SavedJob) => Number(item.userId) === Number(userId) && item.job,
      );

      const jobs = currentUserSavedJobs.map(
        (item: SavedJob) => item.job as Job,
      );

      console.log("CURRENT USER SAVED JOBS:", currentUserSavedJobs);

      console.log("TOTAL:", jobs.length);

      setSavedJobs(jobs);
    } catch (error: any) {
      console.log(
        "GET SAVED JOBS ERROR:",
        error.response?.status,
        error.response?.data ?? error.message,
      );

      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadSavedJobs();
  }, []);

  // =========================
  // POST SAVE JOB
  // =========================

  const saveJob = async (job: Job) => {
    try {
      const userId = await getUserId();

      const jobId = Number(job.id);

      console.log("=================================");

      console.log("SAVE JOB");

      console.log("USER ID:", userId);

      console.log("JOB ID:", jobId);

      console.log("=================================");

      if (!userId) {
        throw new Error("User ID not found. Please login again.");
      }

      if (!Number.isInteger(jobId) || jobId <= 0) {
        throw new Error("Invalid job ID.");
      }

      // POST
      const response = await api.post("/saved-jobs", {
        userId,
        jobId,
      });

      console.log("SAVE JOB STATUS:", response.status);

      console.log("SAVE JOB RESPONSE:", response.data);

      // Refresh from backend
      await loadSavedJobs();

      console.log("JOB SAVED SUCCESSFULLY");
    } catch (error: any) {
      console.log(
        "SAVE JOB ERROR:",
        error.response?.status,
        error.response?.data ?? error.message,
      );

      throw error;
    }
  };

  // =========================
  // DELETE SAVED JOB
  // =========================

  const removeSavedJob = async (jobId: number) => {
    try {
      const userId = await getUserId();

      if (!userId) {
        throw new Error("User ID is not available.");
      }

      const numericJobId = Number(jobId);

      console.log("REMOVE SAVED JOB:", {
        jobId: numericJobId,
        userId,
      });

      await api.delete(`/saved-jobs/${numericJobId}`, {
        data: {
          userId,
        },
      });

      console.log("SAVED JOB REMOVED SUCCESSFULLY");

      await loadSavedJobs();
    } catch (error: any) {
      console.log(
        "REMOVE SAVED JOB ERROR:",
        error.response?.status,
        error.response?.data || error.message,
      );

      throw error;
    }
  };

  // =========================
  // CHECK SAVED
  // =========================

  const isSaved = (jobId: number) => {
    return savedJobs.some((job) => Number(job.id) === Number(jobId));
  };

  // =========================
  // REFRESH
  // =========================

  const refreshSavedJobs = async () => {
    await loadSavedJobs();
  };

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        saveJob,
        removeSavedJob,
        isSaved,
        refreshSavedJobs,
        loading,
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
