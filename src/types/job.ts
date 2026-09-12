export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description?: string | null;
  salary?: string | null;
  createdAt?: string;
}