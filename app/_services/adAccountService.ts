import useFetch from "../_helpers/useFetch";
import { ResponseVM } from "../_models/response.model";
import { AdAccount, Campaign, Adset, AdImagePayload, CampaignPayload, AdsetPayload, Interest, LocationData, AdTargetingCategory, AdCreative, AdCreativePayload, ImageHash, Ads, AdPayloadData, AdData } from "../_models/adAccount.model";
import useFetchMultipart from "../_helpers/useFetchMultipart";

const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT || "https://oneclicksapi.azurewebsites.net";
// const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT || "https://localhost:7256";
// 

async function handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("Content-Type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        if (isJson && data.errors !== null) {
            throw new Error(JSON.stringify(data.errors));
        }

        throw new Error(data.message || response.statusText);
    }
    return data as T;
}

export async function ConnectAdAccount(accessToken: string): Promise<ResponseVM<AdAccount>>{
    const fetch = useFetch();
    const response = await fetch.get(`${SERVER_ENDPOINT}/api/Accounts/getAdAccountData?accessToken=${accessToken}`);
   
    return handleResponse<ResponseVM<AdAccount>>(response).then((data) => data);
}

export async function CreateCampaignService(payload: CampaignPayload): Promise<ResponseVM<Campaign>> {
    const fetch = useFetch();
    const response = await fetch.post(`${SERVER_ENDPOINT}/api/Facebook/CreateCampaign`,payload);

    return handleResponse<ResponseVM<Campaign>>(response).then((data) => data);
}

export async function CreateAdcampaignService(){
    const fetch = useFetch();
    const response = await fetch.post(`${SERVER_ENDPOINT}/api/Facebook/CreateAdset`);

    return handleResponse(response).then((data) => data);
}


export async function getAllCampaignsFacebook(adAccountId: string, accessToken: string):  Promise<ResponseVM<any[]>>{
    const fetch = useFetch();
    const response = await fetch.get(`${SERVER_ENDPOINT}/api/Facebook/GetAllCampaigns?accessToken=${accessToken}&adAccountId=${adAccountId}`);
    
    return handleResponse<ResponseVM<any[]>>(response).then((data) => data);
}

export async function CreateAdsetService(payload: AdsetPayload): Promise<ResponseVM<Adset>> {
    const fetch = useFetch();
    const response = await fetch.post(`${SERVER_ENDPOINT}/api/Facebook/CreateAdset`, payload);

    return handleResponse<ResponseVM<Adset>>(response).then((data) => data);
}

export async function getAllAdsetsService(adAccountId: string, accessToken: string):  Promise<ResponseVM<Adset[]>>{
    const fetch = useFetch();
    const response = await fetch.get(`${SERVER_ENDPOINT}/api/Facebook/GetAllAdsets?accessToken=${accessToken}&adAccountId=${adAccountId}`);
    
    return handleResponse<ResponseVM<Adset[]>>(response).then((data) => data);
}

export async function GetInterestsSearchData(interests: string, accessToken: string):  Promise<ResponseVM<Interest[]>>{
    const fetch = useFetch();
    const response = await fetch.get(`${SERVER_ENDPOINT}/api/Facebook/GetInterests?accessToken=${accessToken}&interests=${interests}`);
    
    return handleResponse<ResponseVM<Interest[]>>(response).then((data) => data);
}

export async function GetIndustrySearchData(accessToken: string): Promise<ResponseVM<AdTargetingCategory[]>>{
    const fetch = useFetch();
    const response = await fetch.get(`${SERVER_ENDPOINT}/api/Facebook/GetTargetingCategory?accessToken=${accessToken}&targetType=industries`);
    
    return handleResponse<ResponseVM<AdTargetingCategory[]>>(response).then((data) => data);
}

export async function GetCitySearchData(city: string, accessToken: string):  Promise<ResponseVM<LocationData[]>>{
    const fetch = useFetch();
    const response = await fetch.get(`${SERVER_ENDPOINT}/api/Facebook/GetCities?accessToken=${accessToken}&city=${city}`);
    
    return handleResponse<ResponseVM<LocationData[]>>(response).then((data) => data);
}

export async function CreateAdImageHashService(adAccountId: string, payload: FormData, accessToken: string): Promise<ResponseVM<string>> {

    const response = await fetch(`${SERVER_ENDPOINT}/api/Facebook/CreateAdImageHash/${adAccountId}?accessToken=${accessToken}`,{
        method : 'PUT', 
        body : payload
    });  
    return handleResponse<ResponseVM<string>>(response).then((data) => data);
    // const response = await fetch.put(`${SERVER_ENDPOINT}/api/Campaigns/CreateAdImageHash/${adAccountId}?accessToken=${accessToken}`, {payload});
}

export async function CreateAdcreativeService(payload: AdCreativePayload): Promise<ResponseVM<AdCreative>> {
    const fetch = useFetch();
    const response = await fetch.post(`${SERVER_ENDPOINT}/api/Facebook/CreateAdCreative`, payload);

    return handleResponse<ResponseVM<AdCreative>>(response).then((data) => data);
}

export async function getAllAdcreativesService():  Promise<ResponseVM<AdCreative[]>>{
    const fetch = useFetch();
    const response = await fetch.get(`${SERVER_ENDPOINT}/api/Facebook/GetAllAdcreatives`);
    
    return handleResponse<ResponseVM<AdCreative[]>>(response).then((data) => data);
}

export async function ScheduleAdService(payload: Ads): Promise<ResponseVM<string>> {
    const fetch = useFetch();
    const response = await fetch.post(`${SERVER_ENDPOINT}/api/Facebook/ScheduleAd`, payload);

    return handleResponse<ResponseVM<string>>(response).then((data) => data);
}

export async function getAllAdsService(adAccountId: string, accessToken: string):  Promise<ResponseVM<AdData[]>>{
    const fetch = useFetch();
    const response = await fetch.get(`${SERVER_ENDPOINT}/api/Facebook/GetAllAdsData?accessToken=${accessToken}&adAccountId=${adAccountId}`);
    
    return handleResponse<ResponseVM<AdData[]>>(response).then((data) => data);
}

export async function getAllAdsPayloadService(adAccountId: string, accessToken: string):  Promise<ResponseVM<AdPayloadData>>{
    const fetch = useFetch();
    const response = await fetch.get(`${SERVER_ENDPOINT}/api/Facebook/GetAllAdsPayload?accessToken=${accessToken}&adAccountId=${adAccountId}`);
    
    return handleResponse<ResponseVM<AdPayloadData>>(response).then((data) => data);
}