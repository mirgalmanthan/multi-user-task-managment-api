import { Request, Response } from "express";
import { ApiResponse } from "../structs/io";
import { hashPassword } from "../helpers/auth";
import { authInputValidator } from "../middlewares/validators";
import { User } from "../db/queries/users";
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') dotenv.config();


export async function registerUser(req: Request, res: Response) {
    console.log("registerUser invoked");
    let body = req.body;
    let response = new ApiResponse();
    let validationErros = authInputValidator(body, 'REGISTER')
    try {
        if (validationErros.length > 0) {
            throw {
                statusCode: 400,
                errors: validationErros
            }
        } else {
            let email = body.email;
            let user = await User.findOne({where: {email}})
            console.log(user)
            if (user) {
                throw {
                    statusCode: 409,
                    errors: ["User already exists"]
                }
            } else {
                let password = await hashPassword(body.password, 12)
                console.log(password)
                console.log(typeof(password))
                let dateTime = new Date();
                let result = await User.create({
                    email: body.email,
                    name: body.name,
                    password: password,
                    created_at: dateTime,
                    updated_at: dateTime
                })
                console.log('create user query result: ')
                console.log(result)
                response.statusCode = 200
                response.payload = {
                    message: 'User registered successfully'
                }
            }
        }
    } catch (error: any) {
        console.log("ERROR: ")
        console.log(error)
        response.statusCode = error.statusCode
        response.errors = error.errors 
    } finally {
        res.status(response.statusCode).json(response)
    }
}