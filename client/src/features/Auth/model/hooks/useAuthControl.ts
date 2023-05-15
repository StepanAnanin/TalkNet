import { useTypedDispatch } from "../../../../shared/model/hooks/useTypedDispatch";
import { addLogin, addLogout, addRefresh } from "../store/actionCreators/authActions";

// TODO try to solve problem described below (in P.S.)

/**
 * This hook can be used in any slice and segment.
 *
 * P.S. —
 * I know this violates architecture's rules, but i didn't found any other way to
 * pass `refreshAuth` (or it's analogue) to any segment and slice, cuz it must be needed in
 * `entity` slice (for example), but i can move this hook into a `shared` slice, cuz it's part of a `Auth` feature.
 */
export default function useAuthControl() {
    const dispatch = useTypedDispatch();

    async function login(email: string, password: string) {
        await dispatch(addLogin(email, password));
    }

    async function logout() {
        await dispatch(addLogout());
    }

    /**
     * Refreshing auth tokens
     */
    async function refreshAuth() {
        await dispatch(addRefresh());
    }

    return { login, logout, refreshAuth };
}
