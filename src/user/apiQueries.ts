import {apiClient} from '../axiosInstance';
import {IBattlestationSummary} from '../battlestations/apiQueries';

export interface IUser {
  user_id: string
  username: string
  email: string
  is_admin: boolean
  is_moderator: boolean
}


export interface IUserBattlestationSummary {
  name: string
  battlestation_id: number
  created_date: string
  image_count: number
  part_count: number
  thumbnail: string
  is_public: number
  favorites: number
}

interface NewUserParams {
  data: string
}
export async function registerNewUser({data}: NewUserParams) {
  const response =  await apiClient.post("/users/", data);
  return response.data;
}

export async function getAllUserBattlestations(id: string, token: string) {
  const response = await apiClient.get<{total: number, battlestations: IUserBattlestationSummary[]}>("/users/" + id + "/battlestations", 
  {
    headers: {Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"}
  });
  return response.data;
}

export async function getFavorites(id: string, token: string) {
  const response =  await apiClient.get<{total: number, battlestations: IBattlestationSummary[]}>("/users/" + id + "/favorites", 
  {
    headers: {Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"}
  });
  return response.data;
}

interface UpdateUserParams {
  id: string
  data: string
  token: string
}
export async function updateUser({id, data, token}: UpdateUserParams) {
  const response =  await apiClient.put("/users/" + id, data, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

export async function getUserProfile(id: string, token: string) {
  const response =  await apiClient.get<IUser>(`/users/${id}`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  return response.data;
}

interface DeleteUserParams {
  id: string
  token: string
}
export async function deleteUser({id, token}: DeleteUserParams) {
  const response =  await apiClient.delete(`/users/${id}`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  return response.data;
}