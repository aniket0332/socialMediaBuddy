import { API_ENDPOINTS, apiGet } from "./apiClient";

export const getfiles = async () => {
    
    const data = await apiGet(API_ENDPOINTS.PUT_FILE);
    console.log("Fetched files:", data);

    const formattedData = data.map((item) => item.url);
    return formattedData;
};
