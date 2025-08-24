import { User } from "../db/queries/users";
import { comparePassword, generateAuthToken } from "../helpers/auth";
import { authInputValidator } from "../middlewares/validators";
import { ApiResponse } from "../structs/io";
import * as dotenv from 'dotenv';
import { Request, Response } from "express";

if (process.env.NODE_ENV !== 'production') dotenv.config();


export async function loginUser(req: Request, res: Response) {
    console.log("userLogin invoked");
    let body = req.body;
    let response = new ApiResponse();
    let validationErros = authInputValidator(body, 'LOGIN');
    try {
        if (validationErros.length > 0) {
            throw {
                erros: validationErros,
                statusCode: 400
            }
        } else {
            let user = await User.findOne({where: {email: body.email}});
            if (!user) {
                throw {
                    erros: ['User not found'],
                    statusCode: 404
                }
            } else {
                let password = body.password;
                let isMatched = await comparePassword(password, user.password)
                if (!isMatched) {
                    throw {
                        erros: ['Invalid credentials'],
                        statusCode: 401
                    }
                } else {
                    let userTokenPayoad = {
                        userId: user.id,
                        email: user.email,
                        name: user.name,
                        password: user.password
                    }
                    console.log("auth token payload")
                    console.log(userTokenPayoad)
                    let refreshToken = generateAuthToken(userTokenPayoad, process.env.JWT_REFRESH_TOKEN_SECRET || '', parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY_MIN || "2"))
                    let updateResponse = await User.update({refresh_token: refreshToken}, {where: {id: user.id}})
                    console.log("update response")
                    console.log(updateResponse)
                    if (updateResponse[0] == 0) {
                        throw {
                            erros: ['User not found'],
                            statusCode: 404
                        }
                    }
                    let token = generateAuthToken(userTokenPayoad, process.env.JWT_ACCESS_TOKEN_SECRET || '', parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY_MIN || "1"))
                    response.statusCode = 200;
                    response.payload = {
                        token: token,
                        refreshToken
                    }
                }
            }
        }
    } catch (error: any) {
        response.errors = error.erros;
        response.statusCode = error.statusCode;
    } finally {
        return res.status(response.statusCode).json(response);
    }

}