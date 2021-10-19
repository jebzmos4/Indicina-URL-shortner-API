import { Response, Request } from 'express';

export interface verifyTokenResponse {
    success: boolean,
    response: string
}

export interface EncodeRequest extends Request {
    url: string
}