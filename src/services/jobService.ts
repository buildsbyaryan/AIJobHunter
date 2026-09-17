import { Job } from "../types/job";
import api from "./api";

export interface JobFilters {
  search?: string;
  location?: string;
  experience?: string;
  type?: string;
  salary?: string;
}

interface JobsResponse {
  jobs: Job[];
  count: number;
}

interface JobResponse {
  job: Job;
}

export const getJobs = async (
  filters?: JobFilters
): Promise<Job[]> => {
  const response = await api.get<JobsResponse>("/jobs", {
    params: filters,
  });

  return response.data.jobs;
};

export const getJobById = async (
  id: number
): Promise<Job> => {
  const response = await api.get<JobResponse>(`/jobs/${id}`);

  return response.data.job;
};

export const createJob = async (
  jobData: Omit<Job, "id" | "createdAt">
): Promise<Job> => {
  const response = await api.post<JobResponse>("/jobs", jobData);

  return response.data.job;
};

export const updateJob = async (
  id: number,
  jobData: Partial<Omit<Job, "id" | "createdAt">>
): Promise<Job> => {
  const response = await api.put<JobResponse>(
    `/jobs/${id}`,
    jobData
  );

  return response.data.job;
};

export const deleteJob = async (
  id: number
): Promise<void> => {
  await api.delete(`/jobs/${id}`);
};