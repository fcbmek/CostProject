import {Router} from 'express';
import {createRequire} from "module";
import {addNewCostByUserId} from "../public/javascripts/db_handlers.js";
import {NoCostForUser, PermissionDenied} from "../public/javascripts/errors.js";

const require = createRequire(import.meta.url);

import {v4 as uuidv4} from 'uuid';
import expressBasicAuth from "express-basic-auth";
import {checkForPermission, validateUser} from "../public/javascripts/validators_handlers.js";


const bodySchema = require('body-schema');

const costSchema = {
    'type': 'object',
    'properties': {
        'cost': {
            'type': 'number'
        },
        'description': {
            'type': 'string'
        },
        'category': {
            'type': 'string'
        }

    },
    'required': ['cost', 'description', 'category']
};
const router = Router();
router.use(expressBasicAuth({
    authorizer: async (username, password, cb) => {
        await validateUser(username, password, cb)
    },
    authorizeAsync: true,
}))

async function ProvideCostContext(reqBodyParams) {
    return {
        "id": uuidv4().toString(),
        "cost": reqBodyParams.cost,
        "description": reqBodyParams.description,
        "category": reqBodyParams.category,
        "date": new Date(Date.now())
    }
}

router.post("/:user_id", bodySchema(costSchema), async (req, res, next) => {
    try {
        await checkForPermission(req.auth["user"], req.params.user_id)
        let costContext = await ProvideCostContext(req.body)
        await addNewCostByUserId(req.params.user_id, costContext)
        res.json(costContext.id);

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

});

export default router;
