import axios from "axios";
export const PostPredict = (text: any, callback: any) => {
    axios.post(`http://192.168.9.85:5000/predict`, { text })
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            console.log(err);
        });
}