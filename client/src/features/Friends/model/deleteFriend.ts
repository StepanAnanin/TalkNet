import { AxiosError } from "axios";
import TalkNetAPI from "../../../shared/api/TalkNetAPI";

export default async function deleteFriend(id: string): Promise<{ ok: boolean; status: number; message: string }> {
    try {
        const response = await TalkNetAPI.delete("/user/friends/" + id);

        return { ok: true, status: response.status, message: response.data.message };
    } catch (err) {
        if (!(err instanceof AxiosError)) {
            throw err;
        }

        return {
            ok: false,
            status: err.response?.status ?? 0,
            message: err.response?.data.message ?? "Не удалось удалить пользователя из списка друзей",
        };
    }
}
