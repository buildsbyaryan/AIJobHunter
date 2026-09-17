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
  try {
    console.log("=================================");
    console.log("FETCH JOBS START");
    console.log("Filters:", filters);
    console.log("API Base URL:", api.defaults.baseURL);
    console.log("=================================");

    const response = await api.get<JobsResponse>(
      "/jobs",
      {
        params: filters,
      }
    );

    console.log(
      "FETCH JOBS RESPONSE:",
      response.status
    );

    console.log(
      "FETCH JOBS DATA:",
      response.data
    );

    return response.data.jobs;
  } catch (error: any) {
    console.log("=================================");
    console.log("FETCH JOBS ERROR");
    console.log("=================================");

    if (error.response) {
      console.log(
        "STATUS:",
        error.response.status
      );

      console.log(
        "DATA:",
        error.response.data
      );
    } else if (error.request) {
      console.log(
        "REQUEST SENT BUT NO RESPONSE"
      );
    } else {
      console.log(
        "ERROR MESSAGE:",
        error.message
      );
    }

    throw error;
  }
};

export const getJobById = async (
  id: number
): Promise<Job> => {
  try {
    console.log("=================================");
    console.log("FETCH JOB DETAILS START");
    console.log("JOB ID:", id);
    console.log(
      "ENDPOINT:",
      `/jobs/${id}`
    );
    console.log("=================================");

    const response = await api.get<JobResponse>(
      `/jobs/${id}`
    );

    console.log(
      "JOB DETAILS RESPONSE:",
      response.status
    );

    console.log(
      "JOB DETAILS DATA:",
      response.data
    );

    return response.data.job;
  } catch (error: any) {
    console.log(
      "================================="
    );

    console.log(
      "FETCH SINGLE JOB ERROR"
    );

    console.log(
      "================================="
    );

    if (error.response) {
      console.log(
        "STATUS:",
        error.response.status
      );

      console.log(
        "DATA:",
        error.response.data
      );
    } else {
      console.log(
        "MESSAGE:",
        error.message
      );
    }

    throw error;
  }
};

export const createJob = async (
  jobData: Omit<Job, "id" | "createdAt">
): Promise<Job> => {
  try {
    const response =
      await api.post<JobResponse>(
        "/jobs",
        jobData
      );

    return response.data.job;
  } catch (error: any) {
    console.log("CREATE JOB ERROR");

    if (error.response) {
      console.log(
        "STATUS:",
        error.response.status
      );

      console.log(
        "DATA:",
        error.response.data
      );
    } else {
      console.log(
        "MESSAGE:",
        error.message
      );
    }

    throw error;
  }
};

export const updateJob = async (
  id: number,
  jobData: Partial<
    Omit<Job, "id" | "createdAt">
  >
): Promise<Job> => {
  try {
    const response =
      await api.put<JobResponse>(
        `/jobs/${id}`,
        jobData
      );

    return response.data.job;
  } catch (error: any) {
    console.log("UPDATE JOB ERROR");

    if (error.response) {
      console.log(
        "STATUS:",
        error.response.status
      );

      console.log(
        "DATA:",
        error.response.data
      );
    } else {
      console.log(
        "MESSAGE:",
        error.message
      );
    }

    throw error;
  }
};

export const deleteJob = async (
  id: number
): Promise<void> => {
  try {
    await api.delete(`/jobs/${id}`);
  } catch (error: any) {
    console.log("DELETE JOB ERROR");

    if (error.response) {
      console.log(
        "STATUS:",
        error.response.status
      );

      console.log(
        "DATA:",
        error.response.data
      );
    } else {
      console.log(
        "MESSAGE:",
        error.message
      );
    }

    throw error;
  }
};