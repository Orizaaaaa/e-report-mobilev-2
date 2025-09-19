import axios from "axios";

export const PostPredict = async (text: string): Promise<{ prediction: string }> => {
    try {
        const response = await axios.post(`https://oriza.pythonanywhere.com/predict`, { text });
        return response.data; // { prediction: 'prioritas' } misalnya
    } catch (error) {
        console.error("Gagal mengambil prediksi:", error);
        throw error;
    }
};
