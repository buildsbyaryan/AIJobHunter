export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  experience?: string | null;
  description?: string | null;
  salary?: string | null;
  createdAt?: string;
}