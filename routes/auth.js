import {Router} from 'express';
import expressBasicAuth from "express-basic-auth";
import {validateUser} from "../public/javascripts/validators_handlers";
const router = Router();
router.use(expressBasicAuth({
    authorizer: async (username, password, cb) => {
        await validateUser(username, password, cb)
    },
    authorizeAsync: true,
}))

router.get("", async (req, res) => {
    res.json(true);
});

export default router;
