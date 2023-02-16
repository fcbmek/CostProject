import {Router} from 'express';
import {getAllCostByUserId} from "../public/javascripts/db_handlers.js";
import {NoCostForUser, PermissionDenied} from "../public/javascripts/errors.js";
import expressBasicAuth from "express-basic-auth";
import {validateUser, checkForPermission} from "../public/javascripts/validators_handlers.js";

const router = Router();
router.use(expressBasicAuth({
    authorizer: async (username, password, cb) => {
        await validateUser(username, password, cb)
    },
    authorizeAsync: true,
}))

router.get("/:user_id", async (req, res, next) => {
        try {
            await checkForPermission(req.auth["user"], req.params.user_id)
            let expenses = await getAllCostByUserId(req.params.user_id)
            res.json(expenses);
        } catch (e) {
            if (e instanceof NoCostForUser) {
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

    }
)
;
export default router;