import {isUserExists} from "./db_handlers.js";
import {UserAlreadyExist, PermissionDenied} from "./errors.js";
import {getUserByUsername} from "./db_handlers.js";
import expressBasicAuth from "express-basic-auth";


async function getUserCreds(username) {
    if (await isUserExists(username) === false) {
        return false
    }
    const user_creds = await getUserByUsername(username)
    return [username, user_creds["password"]]
}

async function validateUser(username, password, cb) {
    const creds = await getUserCreds(username)
    if (creds === false)
        return cb(null, false)
    const userMatches = expressBasicAuth.safeCompare(username, creds[0])
    const passwordMatches = expressBasicAuth.safeCompare(password, creds[1])
    if (userMatches && passwordMatches)
        return cb(null, true)
    else
        return cb(null, false)
}

async function checkForPermission(authUser, reqUser) {
    if (authUser !== reqUser) throw new PermissionDenied
}

async function DoesUserExist(userId) {
    if (await isUserExists(userId) === true) throw new UserAlreadyExist()

}

export {getUserCreds, DoesUserExist, validateUser, checkForPermission}