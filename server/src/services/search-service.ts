import UserModel from "../DB/models/User";
import HTTPError from "../errors/HTTPError";

class SearchService {
    // TODO try to make it more compact (i just didn't want to fuck with mongodb queries which are implemented as shit)
    public async searchForUser(page: number, name?: string, surname?: string, patronymic?: string) {
        if (page < 1) {
            throw new HTTPError(400, "Page must be equal or greater than 1");
        }

        page = page - 1;

        // if all
        if (typeof name === "string" && typeof surname === "string" && typeof patronymic === "string") {
            return await UserModel.find(
                {
                    name: new RegExp("^" + name, "i"),
                    surname: new RegExp("^" + surname, "i"),
                    patronymic: new RegExp("^" + patronymic, "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if name & surname
        if (typeof name === "string" && typeof surname === "string") {
            return await UserModel.find(
                {
                    name: new RegExp("^" + name, "i"),
                    surname: new RegExp("^" + surname, "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if name & patronymic
        if (typeof name === "string" && typeof patronymic === "string") {
            return await UserModel.find(
                {
                    name: new RegExp("^" + name, "i"),
                    patronymic: new RegExp("^" + patronymic, "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if surname & patronymic
        if (typeof surname === "string" && typeof patronymic === "string") {
            return await UserModel.find(
                {
                    surname: new RegExp("^" + surname, "i"),
                    patronymic: new RegExp("^" + patronymic, "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if only surname
        if (typeof surname === "string") {
            return await UserModel.find(
                {
                    surname: new RegExp("^" + surname, "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if only name
        if (typeof name === "string") {
            return await UserModel.find(
                {
                    name: new RegExp("^" + name, "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }

        // if only patronymic
        if (typeof patronymic === "string") {
            return await UserModel.find(
                {
                    patronymic: new RegExp("^" + patronymic, "i"),
                },
                {},
                { skip: 20 * page, limit: 20 }
            );
        }
    }
}

export default new SearchService();
