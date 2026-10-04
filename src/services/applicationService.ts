import api from "@/services/api";

export type ApplicationStatus =
  | "applied"
  | "interview"
  | "selected"
  | "rejected";

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    company: string;
    location?: string | null;
  };
}

export async function applyForJob(jobId: string) {
  const response = await api.post("/applications", { jobId });
  return response.data.application as Application;
}

export async function getMyApplications() {
  const response = await api.get("/applications");
  return response.data.applications as Application[];
}

export async function getApplicationById(id: string) {
  const response = await api.get(`/applications/${id}`);
  return response.data.application as Application;
}