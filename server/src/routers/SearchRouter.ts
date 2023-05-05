import { Router } from "express";
import SearchController from "../controller/search-controller";

/**
 *      Handle '/search' route
 */

const SearchRouter = Router();

SearchRouter.get("/user", SearchController.searchForUser);

export default SearchRouter;
