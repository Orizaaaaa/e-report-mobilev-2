import axios from "axios";

const cloudName = "dddnlyaho";

export const postImage = async ({ image }: { image: string }) => {
    try {
        const formData = new FormData();

        formData.append("file", {
            uri: image,                // ✅ langsung pakai uri dari ImagePicker
            type: "image/jpeg",        // ✅ pastikan type sesuai
            name: `upload_${Date.now()}.jpg`, // ✅ jangan ada slash di name
        } as any);

        formData.append("upload_preset", "desa_cms"); // unsigned preset

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log("Cloudinary upload result:", data);

        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error(data.error?.message || "Upload gagal tanpa pesan error");
        }
    } catch (error) {
        console.error("Error uploading the image", error);
        return null;
    }
};



export const postImagesArray = async ({ images }: { images: any[] }) => {
    const urls = [];

    for (const image of images) {
        const apiRequest = new FormData();
        apiRequest.append('file', image as File);  // Menggunakan 'file' sebagai parameter
        apiRequest.append('upload_preset', 'desa_cms');  // Ganti dengan upload preset Anda

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                apiRequest
            );
            console.log(response.data.secure_url);
            urls.push(response.data.secure_url);
        } catch (error) {
            console.error('Error uploading the image', error);
            urls.push(null);  // Menambahkan null jika terjadi error pada salah satu gambar
        }
    }
    return urls;
}

