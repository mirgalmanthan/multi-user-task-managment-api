export function authInputValidator(body: any, type: string) {
    let errors = [];
    if (type == 'REGISTER' && !body.name) errors.push("name is required");
    if (!body.email) errors.push("email is required");
    if (!body.password) errors.push("password is required");
    return errors;
}