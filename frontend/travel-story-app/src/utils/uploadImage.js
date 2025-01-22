import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post('/image-upload', formData, {
            headers: {
                "Content-Type": 'multipart/form-data' // Correct header name
            },
        });
        return response.data;
    } catch (err) {
        console.error("Image Uploading Error:", err);
        throw err;
    }
};

export default uploadImage;
