export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
 experience?: string;
  salary?: string | null;
  type?: string | null;
  description?: string | null;
  requirements?: string | null;
  skills?: string[];
  createdAt?: string;
}