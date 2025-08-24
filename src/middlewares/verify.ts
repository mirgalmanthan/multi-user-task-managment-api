import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') dotenv.config();

type TokenType = 'access' | 'refresh';
interface TokenPayload extends JwtPayload {
    userId: string,
    email: string,
    name: string,
    password: string
}

const TOKEN_SECRETS = {
    access: process.env.JWT_ACCESS_TOKEN_SECRET || 'default_access_secret',
    refresh: process.env.JWT_REFRESH_TOKEN_SECRET || 'default_refresh_secret'
} as const;

const createTokenVerifier = (tokenType: TokenType) =>
    (request: Request, response: Response, next: NextFunction): void => {
        const token = request.headers.authorization?.replace(/^Bearer\s+/i, '') || '';

        if (!token) {
            sendErrorResponse(response, 'No token provided');
            return;
        }

        try {
            const payload = jwt.verify(token, TOKEN_SECRETS[tokenType]) as TokenPayload;

            request.body = {
                ...request.body,
                email: payload.id,
                name: payload.name,
                ...(payload.email && { email: payload.email })
            };

            next();
        } catch (error) {
            console.error(`Token verification failed (${tokenType}):`, error);
            const message = error instanceof jwt.TokenExpiredError
                ? 'Token expired'
                : 'Invalid token';
            sendErrorResponse(response, message);
        }
    };


const sendErrorResponse = (response: Response, message: string, statusCode = 403): void => {
    response.status(statusCode).json({
        success: false,
        error: {
            message,
            code: 'AUTH_ERROR'
        }
    });
};

export const verifyAuthToken = createTokenVerifier('access');
export const verifyRefreshToken = createTokenVerifier('refresh');