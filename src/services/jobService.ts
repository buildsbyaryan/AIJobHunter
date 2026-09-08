import { Job } from "../types/job";
import api from "./api";

export const getJobs = async (): Promise<Job[]> => {
  const response = await api.get("/jobs");

  console.log("JOBS API RESPONSE:", response.data);

  return response.data.jobs;
};

export const createJob = async (jobData: {
  title: string;
  company: string;
  location: string;
  type: string;
  description?: string;
  salary?: string;
}) => {
  const response = await api.post(
    "/jobs",
    jobData
  );

  return response.data;
};