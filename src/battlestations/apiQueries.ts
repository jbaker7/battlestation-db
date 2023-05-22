import {apiClient} from '../axiosInstance';


export interface IBattlestation {
  user_id: string
  battlestation_id: number
  name: string
  instagram_url: string
  reddit_url: string | undefined
  images: string[]
  parts: {
    part_id: number
    name: string
    image: string
    type_id: number
    type_name: string
  }[]
  description: string | null
  username: string
  created_date: string
  favorites: number
  is_favorited: number
}

export interface IBattlestationSummary {
  battlestation_id: number
  name: string
  image_count: number
  part_count: number
  thumbnail: string
  username: string
  created_date: string
  favorites: number
}

interface NewBattlestationParams {
  data: FormData
  token: string
}
export async function postNewBattlestation({data, token}: NewBattlestationParams) {
  const response =  await apiClient.post<{newId: number}>("/battlestations/", data, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}


interface UpdateBattlestationParams {
  id: string
  data: FormData
  token: string
}
export async function updateBattlestation({id, data, token}: UpdateBattlestationParams) {
  const response =  await apiClient.put("/battlestations/id/" + id, data, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

export interface QueryParams {
  resultsPerPage: number
  pageNumber: number
  sortBy: string
  direction: string
  searchTerm?: string
}
export async function getAllBattlestations(queryParams: QueryParams) {
  const response =  await apiClient.get<{total: number, battlestations: IBattlestationSummary[]}>("/battlestations", {params: queryParams});
  return response.data;
}

export interface GetOneBattlestationParams {
  id: string
  token?: string
}
export async function getOneBattlestation({id, token}: GetOneBattlestationParams) {
  let headers = {};
  if (token) {
    headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }
  const response =  await apiClient.get<IBattlestation>("/battlestations/id/"+id, headers);
  return response.data;
}

interface DeleteParams {
  id: number
  token: string
}
export async function deleteBattlestation({id, token}: DeleteParams) {
  const response =  await apiClient.delete<String>("/battlestations/id/" + id, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

export async function getFeaturedBattlestations() {
  const response =  await apiClient.get<IBattlestationSummary[]>("/battlestations/featured");
  return response.data;
}
export async function getBattlestationParts(id: number | null | undefined) {
  if (id) {
    const response =  await apiClient.get<{part_id: number, name: string, type_id: number, type_name: string, image: string}[]>("/battlestations/id/"+id+"/parts");
    return response.data;
  }
  else {
    return [];
  }
  
}

export interface FavoriteBattlestationParams {
  id: string
  action: string
  token: string
}
export async function saveFavoriteBattlestation({id, action, token}: FavoriteBattlestationParams) {
  const response =  await apiClient.put<String>("/battlestations/favorites/" + id, {action: action}, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}

interface NewPartApprovalParams {
  data: FormData
  token: string
}
export async function submitNewPart({data, token}: NewPartApprovalParams) {
  const response =  await apiClient.post<{newId: number}>("/parts/request", data, {
    headers: {Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",}
  });
  return response.data;
}