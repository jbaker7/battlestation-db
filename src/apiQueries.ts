import {apiClient} from './axiosInstance';

export interface IUser {
  user_id: string
  username: string
  email: string
  is_admin: boolean
  is_moderator: boolean
}

interface IBasicStore {
  name: string
  url: string
}

export interface IStore extends IBasicStore {
  store_id: number
  part_count: number
}

export async function getStoreCount() {
  const response =  await apiClient.get<{total: string}>("/stores/count");
  return response.data;
}

export interface QueryParams {
  resultsPerPage: number
  pageNumber: number
  sortBy: string
  direction: string
  searchTerm?: string
}
export async function getAllStores(queryParams: QueryParams) {
  const response =  await apiClient.get<IStore[]>("/stores", {params: queryParams});
  return response.data;
}

interface NewStoreParams {
  data: IBasicStore
  token: string
}
export async function postNewStore({data, token}: NewStoreParams) {
  const response =  await apiClient.post("/stores", data, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

interface UpdateParams {
  id: number
  data: IBasicStore
  token: string
}
export async function updateStore({id, data, token}: UpdateParams) {
  const response =  await apiClient.put("/stores/" + id, data, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

interface DeleteParams {
  id: number
  token: string
}
export async function deleteStore({id, token}: DeleteParams) {
  const response =  await apiClient.delete<String>("/stores/" + id, {
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