import * as jwt from 'jsonwebtoken';
import {Injectable} from '@nestjs/common';
import {ITokenService} from './interface/ITokenService';
import * as process from "process";
import {GenerateTokensPayloadDto} from "./dto/GenerateTokensPayload.dto";

@Injectable()
export class TokenService implements ITokenService {
    constructor() {
    }

    generateTokens(payload: GenerateTokensPayloadDto) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '5m',
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '24h',
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    validateRefreshToken(token: string): GenerateTokensPayloadDto {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as GenerateTokensPayloadDto
        } catch {
            return null
        }
    }

    validateAccessToken(token: string): GenerateTokensPayloadDto {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as GenerateTokensPayloadDto
        } catch {
            return null
        }
    }
}
