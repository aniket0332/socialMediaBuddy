import { API_ENDPOINTS, apiPost } from "./apiClient";

export const generatePost = async (body) => {
  console.log("Generating post with body:", body);

    const data = await apiPost(API_ENDPOINTS.AGENT,
    body);
    return data;
};