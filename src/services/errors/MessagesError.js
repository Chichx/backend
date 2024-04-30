function generateUserErrorMessage(user) {
        return `One or more properties were sent incomplete or are not valid.
        List of required properties:
            -> first_name: type String, received: ${user.first_name}
            -> email: type String, received: ${user.email}
    `;
}

function existingUser(user) {
    return `One or more properties were sent existing.
    List of required properties:
        -> email: type String, received: ${user.email}
`;
}

module.exports = {generateUserErrorMessage, existingUser};