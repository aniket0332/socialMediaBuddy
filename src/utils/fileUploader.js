export const handleUpload = async (e) => {
  const files = Array.from(e.target.files);

  for (let file of files) {
    // export 1. Get pre-signed URL
    const res = await fetch("YOUR_API_GATEWAY_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If using Cognito:
        // Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    const { uploadUrl, fileUrl } = await res.json();

    // 2. Upload file to S3
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    console.log("Uploaded:", fileUrl);

    // 👉 Add this to your gallery state
    // setImages(prev => [...prev, fileUrl]);
  }
};