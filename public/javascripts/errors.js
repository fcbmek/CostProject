class NoCostForUser extends Error {
    constructor() {
        super("No costs were found for this user");
        this.name = "NoCostForUser";
    }
}

class NoCostBetweenDates extends Error {
    constructor() {
        super("No Costs were found for this user in those current dates");
    }
}

class NoCostWithCurrentCategory extends Error {
    constructor() {
        super("No Costs were found for this user with this category");
    }
}

class UserAlreadyExist extends Error {
    constructor() {
        super("User is already exists");
    }
}

class PermissionDenied extends Error {
    constructor() {
        super("The user does not have the appropriate permissions for the operation");
    }
}


export {NoCostForUser, NoCostBetweenDates, NoCostWithCurrentCategory, UserAlreadyExist, PermissionDenied}