import axios from "axios";
export const PostPredict = (text: any, callback: any) => {
    axios.post(`https://oryza22.pythonanywhere.com/predict`, { text })
        .then((result) => {
            callback(result.data)
        }).catch((err) => {
            console.log(err);
        });
}