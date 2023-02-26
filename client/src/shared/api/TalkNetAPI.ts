import axios from "axios";
import TalkNetApiURL from "../lib/URL/TalkNetApiURL";

const TalkNetAPI = axios.create({
    withCredentials: true,
    baseURL: TalkNetApiURL,
});

export default TalkNetAPI;
