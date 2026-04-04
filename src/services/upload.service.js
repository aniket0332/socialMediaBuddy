import { API_ENDPOINTS, apiPost, getAuthHeader } from "./apiClient";
import { logout } from "../utils/auth";

export const handleUpload = async (files) => {
  for (let file of files) {
    const res = await apiPost(API_ENDPOINTS.PUT_FILE, {
      fileName: file.name,
      fileType: file.type,
    });

    const { uploadUrl, fileUrl } = res;

    // 2. Upload file to S3
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (uploadRes.status === 401) {
      logout();
      throw new Error("Unauthorized - Logged out");
    }

    console.log(uploadRes.status);
    const text = await uploadRes.text();
    console.log(text);
    console.log("Uploaded:", fileUrl);

    // 👉 Add this to your gallery state
    // setImages(prev => [...prev, fileUrl]);
  }
};
