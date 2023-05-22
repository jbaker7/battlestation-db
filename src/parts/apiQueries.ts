import {apiClient} from '../axiosInstance';
import {IBattlestationSummary} from '../battlestations/apiQueries';

export interface IPartTypes {
    type_id: number
    type_name: string
    type_path: string
    display_order: number
}

export interface IPart {
    part_id: number
    name: string
    manufacturer: string
    manufacturer_url: string | undefined
    type_id: number
    type: string
    image: string
    stores: {store_id: number, store_name: string, url: string}[]
    battlestation_count: number
  }

export async function getPartTypes() {
    const response =  await apiClient.get<IPartTypes[]>("/parts/types");
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

interface BattlestationQueryParams{
    partId: string
    pageNumber: number
}

export async function getAllBattlestationsByParts(battlestationQueryParams: BattlestationQueryParams) {
    const response =  await apiClient.get<{total: number, battlestations: IBattlestationSummary[]}>(`/parts/id/${battlestationQueryParams.partId}/battlestations`, {params: {page_number: battlestationQueryParams.pageNumber}});
    return response.data;
}

export async function getOnePart(id: string) {
    const response =  await apiClient.get<IPart>("/parts/id/"+id);
    return response.data;
}

export async function getPartCount() {
    const response =  await apiClient.get<{total: string}>("/parts/count");
    return response.data;
}

export interface IPartAutoComplete {
    part_id: number
    name: string
    image: string
    type_id: number
    type_name: string
  }
export async function getAutocomplete(partType: number) {
    let params = {partType: partType}
    const response =  await apiClient.get<IPartAutoComplete[]>("/parts/autocomplete", {params: params});
    return response.data;
}