export function authInputValidator(body: any) {
    let errors = [];
    if (!body.name) errors.push("name is required");
    if (!body.email) errors.push("email is required");
    if (!body.password) errors.push("password is required");
    return errors;
}