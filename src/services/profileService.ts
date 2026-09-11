import api from "./api";

interface Profile {
  id: number;
  name: string;
  email: string;
}

interface ProfileResponse {
  user: Profile;
}

export const getProfile = async (): Promise<Profile> => {
  const response = await api.get<ProfileResponse>("/profile");

  return response.data.user;
};