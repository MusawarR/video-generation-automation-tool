export const uploadToCloudinary = async (blob) => {
    const formData = new FormData()
    formData.append("file", blob)
    formData.append("upload_preset", "audio_upload")

    const res = await fetch("https://api.cloudinary.com/v1_1/datrxojqp/auto/upload", {
        method: "POST",
        body: formData
    })

    const cloudinaryResponse = await res.json()
    return cloudinaryResponse.secure_url
}