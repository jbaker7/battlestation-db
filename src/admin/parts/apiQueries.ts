import {apiClient} from '../../axiosInstance';
//import {IStore} from '../stores/apiQueries';

type PartLink = {
  store_id: number,
  store_name: string,
  url: string
}

export interface PendingPart {
  part_id: number
  name: string
  url: string
  status: string
}

export interface IBasicPart {
  name: string
  manufacturer: string
  manufacturer_url: string | undefined
  type_id: number
  image: string
  stores: {store_id: number, store_name: string, url: string}[]
}

export interface IPart extends IBasicPart {
  
  type: string
  part_id: number
  battlestation_count: number
}

export interface IPartTypes {
    type_id: number
    type_name: string
    type_path: string
    display_order: number
}

export async function getPartTypes() {
    const response =  await apiClient.get<IPartTypes[]>("/parts/types");
    return response.data;
}

export async function getPartCount() {
  const response =  await apiClient.get<{total: string}>("/parts/count");
  return response.data;
}

export interface QueryParams {
  resultsPerPage: number
  pageNumber: number
  sortBy: string
  direction: string
  searchTerm?: string
  partType?: string
}
export async function getAllParts(queryParams: QueryParams) {
  const response =  await apiClient.get<{total: number, parts: IPart[]}>("/parts", {params: queryParams});
  return response.data;
}

export async function getPendingParts({token}: {token: string}) {
  const response =  await apiClient.get<PendingPart[]>("/parts/pending", {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

interface NewPartParams {
  data: FormData
  token: string
}
export async function postNewPart({data, token}: NewPartParams) {
  const response =  await apiClient.post("/parts/", data, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

interface UpdateParams {
  id: number
  data: FormData
  token: string
}
export async function updatePart({id, data, token}: UpdateParams) {
  const response =  await apiClient.put("/parts/" + id, data, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

interface DeleteParams {
  id: number
  token: string
}
export async function deletePart({id, token}: DeleteParams) {
  const response =  await apiClient.delete<String>("/parts/" + id, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

export async function deletePendingPart({id, token}: DeleteParams) {
  const response =  await apiClient.delete<String>("/parts/pending/" + id, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

export async function updatePendingPart({id, status, token}: {id: number, status: string, token: string}) {
  const response =  await apiClient.put("parts/pending/" + id, {status: status}, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}