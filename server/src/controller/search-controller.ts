import type { Request, Response } from "express";

import HTTPError from "../errors/HTTPError";
import validateRequest from "../lib/validators/validateRequest";
import SearchService from "../services/search-service";

class SearchController {
    public async searchForUser(req: Request, res: Response) {
        const page = parseInt(req.query.page as string);

        if (typeof page !== "number" || Number.isNaN(page)) {
            res.status(400).json({ message: "Search page is missing or has incorrect data type" });
            return;
        }

        const validationResult = validateRequest(req.query, [
            { key: "name", type: "string", exact: true },
            { key: "surname", type: "string", exact: true },
            { key: "patronymic", type: "string", exact: true },
        ]);

        if (!validationResult.ok) {
            res.status(400).json({ message: validationResult.message });
            return;
        }

        const name = req.query.name as string | undefined;
        const surname = req.query.surname as string | undefined;
        const patronymic = req.query.patronymic as string | undefined;

        try {
            const searchResult = (await SearchService.searchForUser(page, name, surname, patronymic))!.map((user) => {
                return { id: user._id, name: user.name, surname: user.surname, patronymic: user.patronymic };
            });

            res.status(200).json(searchResult);
        } catch (err: any) {
            if (err instanceof HTTPError && err.errorCode === 401) {
                res.status(err.errorCode).json({ message: `Требуется аутентификация` });
                return;
            }

            res.status(500).json({ message: `Что-то пошло не так...` });
            console.error(err);
        }
    }
}

export default new SearchController();
