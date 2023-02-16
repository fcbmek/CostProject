import {Router} from 'express';
import {NoCostBetweenDates, NoCostWithCurrentCategory, PermissionDenied} from "../public/javascripts/errors.js";
import {getCostStatisticByDates, getCostStatisticByCategory} from "../public/javascripts/db_handlers.js";
import expressBasicAuth from "express-basic-auth";
import {checkForPermission, validateUser} from "../public/javascripts/validators_handlers.js";

const router = Router();

router.use(expressBasicAuth({
    authorizer: async (username, password, cb) => {
        await validateUser(username, password, cb)
    },
    authorizeAsync: true,
}))


router.get("/:user_id/year/:year", async (req, res, next) => {
    try {
        await checkForPermission(req.auth["user"], req.params.user_id)
        let endYear = parseInt(req.params.year) + 1
        let startDate = new Date(req.params.year, 0, 1)
        let endDate = new Date(endYear, 0, 1)
        let cost = await getCostStatisticByDates(req.params.user_id, startDate, endDate)
        res.json(cost);
    } catch (e) {
        if (e instanceof NoCostBetweenDates) {
            res.status(404)
            next(e)
        } else if (e instanceof PermissionDenied) {
            res.status(403)
            next(e)
        } else {
            res.status(500)
            next(e)
        }
    }

});


router.get("/:user_id/year/:year/month/:month", async (req, res, next) => {
    try {
        await checkForPermission(req.auth["user"], req.params.user_id)
        let month = parseInt(req.params.month) - 1
        let endMonth = parseInt(req.params.month)
        let endYear = parseInt(req.params.year)
        if (month === 11) {
            endMonth = 0
            endYear = endYear + 1
        }
        let startDate = new Date(req.params.year, month, 1)
        let endDate = new Date(endYear, endMonth, 1)
        let expenses = await getCostStatisticByDates(req.params.user_id, startDate, endDate)
        res.json(expenses);
    } catch (e) {
        if (e instanceof NoCostBetweenDates) {
            res.status(404)
            next(e)
        } else if (e instanceof PermissionDenied) {
            res.status(403)
            next(e)
        } else {
            res.status(500)
            next(e)
        }
    }

});

router.get("/:user_id/category/:category", async (req, res, next) => {
    try {
        await checkForPermission(req.auth["user"], req.params.user_id)
        let expenses = await getCostStatisticByCategory(req.params.user_id, req.params.category)
        res.json(expenses);
    } catch (e) {
        if (e instanceof NoCostWithCurrentCategory) {
            res.status(404)
            next(e)
        } else if (e instanceof PermissionDenied) {
            res.status(403)
            next(e)
        } else {
            res.status(500)
            next(e)
        }
    }

});


export default router;