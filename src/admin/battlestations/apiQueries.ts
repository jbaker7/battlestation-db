import {apiClient} from '../../axiosInstance';
import {QueryParams} from '../../battlestations/apiQueries';

export interface IAdminBattlestationSummary {
    battlestation_id: number
    name: string
    image_count: number
    part_count: number
    thumbnail: string
    username: string
    created_date: string
    favorites: number
    is_public: number
  }

export async function getAllBattlestations(queryParams: QueryParams, token: string) {
    const response =  await apiClient.get<{total: number, battlestations: IAdminBattlestationSummary[]}>("/admin/battlestations", 
    {params: queryParams,
    headers: {Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",}
    });
    return response.data;
  }