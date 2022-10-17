export enum HttpMessage {
    userNotFound = "User doesn't exist!",
    wrongInfo = "Incorrect password or username.",
    invalidSession = "Invalid session token.",
}

export enum AuthError {
    sessionNotFound = "SESSION_NOT_FOUND",
    userNotFound = "USER_NOT_FOUND",
}
