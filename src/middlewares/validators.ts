export function authInputValidator(body: any, type: string) {
    let errors = [];
    if (type == 'REGISTER' && !body.name) errors.push("name is required");
    if (!body.email) errors.push("email is required");
    if (!body.password) errors.push("password is required");
    return errors;
}

export function taskInputValidator(body: any) {
    let errors = [];
    if (!body.title) errors.push("title is required");
    if (!body.description) errors.push("description is required");
    return errors;
}