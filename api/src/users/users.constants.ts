export enum UserError {
    userNotFound = "User not found.",
    addYourself = "You can't add yourself as a friend.",
    alreadyFriend = "You are already friends with this user.",
    alreadySentRequest = "You already sent a friend request to this user.",
    blockUser = "You blocked this user.",
    blockedUser = "This user blocked you.",
    requestAccepted = "Friend request accepted.",
    requestSent = "Friend request sent.",
    friendRemove = "Friend removed.",
    cancelRequest = "Friend request canceled.",
    declinedRequest = "Friend request declined.",
    internalServer = "Somethings wrongs was happen!",
    currentlyOff = "User registration is currently turned off.",
    conflictUsername = "This username is existed!",
}

export enum UserType {
    userNotFound = "USER_NOT_FOUND",
    addYourself = "ADD_YOURSELF",
    alreadyFriend = "ALREADY_FRIEND",
    alreadySentRequest = "ALREADY_SENT_REQUEST",
    blockUser = "BLOCK_USER",
    blockedUser = "BLOCKED_USER",
    requestAccepted = "REQUEST_ACCEPTED",
    requestSent = "REQUEST_SENT",
    friendRemove = "FRIEND_REMOVE",
    cancelRequest = "CANCEL_REQUEST",
    declinedRequest = "DECLINED_REQUEST",
    internalServer = "INTERNAL_SERVER",
    currentlyOff = "CURRENTLY_OFF",
    conflictUsername = "CONFLICT_USERNAME",
}
