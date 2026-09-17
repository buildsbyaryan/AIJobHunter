import { Job } from "../types/job";
import api from "./api";

interface SavedJobsResponse {
  message: string;
  count: number;
  jobs: Job[];
}

interface SavedStatusResponse {
  saved: boolean;
}

interface SavedJobResponse {
  message: string;
  savedJob?: unknown;
}

export const saveJob = async (
  jobId: number
): Promise<SavedJobResponse> => {
  const response = await api.post<SavedJobResponse>(
    `/saved-jobs/${jobId}`
  );

  return response.data;
};

export const unsaveJob = async (
  jobId: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/saved-jobs/${jobId}`
  );

  return response.data;
};

export const getSavedJobs = async (): Promise<Job[]> => {
  const response = await api.get<SavedJobsResponse>(
    "/saved-jobs"
  );

  return response.data.jobs;
};

export const checkSavedJob = async (
  jobId: number
): Promise<boolean> => {
  const response = await api.get<SavedStatusResponse>(
    `/saved-jobs/${jobId}/check`
  );

  return response.data.saved;
};