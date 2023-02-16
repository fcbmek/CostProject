import {Router} from 'express';
import {createRequire} from "module";
import {insertNewUser} from "../public/db_handlers.js";
import {DoesUserExist} from "../public/validators_handlers.js";
import {UserAlreadyExist} from "../public/errors.js";

const require = createRequire(import.meta.url);


const bodySchema = require('body-schema');

var user_schema = {
  'type': 'object',
  'properties': {
    'user_id': {'type': 'string'},
    'first_name': {'type': 'string'},
    'last_name': {'type': 'string'},
    'password': {'type': 'string'},
    'birthday_day': {'type': 'number'},
    'birthday_month': {'type': 'number'},
    'birthday_year': {'type': 'number'},


  },
  'required': ['user_id', 'first_name', 'last_name', 'password', 'birthday_day', 'birthday_month', 'birthday_year']
};

const router = Router();

async function create_user_context(req_body_params) {
  return {
    "user_id": req_body_params.user_id,
    "first_name": req_body_params.first_name,
    "last_name": req_body_params.last_name,
    "password": req_body_params.password,
    "birthday": new Date(req_body_params.birthday_year, parseInt(req_body_params.birthday_month) - 1, req_body_params.birthday_day),

  }
}


router.post("", bodySchema(user_schema), async (req, res, next) => {
  try {
    let user_context = await create_user_context(req.body)
    await DoesUserExist(user_context.user_id)
    await insertNewUser(user_context)
    res.json(user_context.user_id);

  } catch (e) {
    if (e instanceof UserAlreadyExist) {
      res.status(409)
      next(e)
    } else {
      res.status(500)
      next(e)
    }
  }

});


export default router;
