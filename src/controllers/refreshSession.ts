import { User } from "../db/queries/users";
import { generateAuthToken } from "../helpers/auth";
import { ApiResponse } from "../structs/io";
import { Request, Response } from "express";

export async function refreshSession(req: Request, res: Response) {
    console.log("refreshSession invoked");
    let response = new ApiResponse();
    console.log(req.body)
    let refreshToken = req.headers.authorization?.replace(/^Bearer\s+/i, '') || '';
    try {
        let user = await User.findOne({where: {email: req.body.email, refresh_token: refreshToken}})
        console.log(user)
        if (!user) {
            throw {
                erros: ['User not found'],
                statusCode: 404
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
    } catch (error: any) {
        response.errors = error.erros;
        response.statusCode = error.statusCode;
    } finally {
        res.status(response.statusCode).json(response)
    }
}
