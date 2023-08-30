import {ITokenRepository} from '../../repositories/TokenRepository/ITokenRepository';
import * as jwt from 'jsonwebtoken';
import {SaveRefreshTokenDto} from './dto/SaveRefreshToken.dto';
import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {ITokenService} from './interface/ITokenService';
import {Token} from '../../entities/Token/Token';
import * as process from "process";
import {IUserRepository} from "../../repositories/UserRepository/IUserRepository";
import {GenerateTokensPayloadDto} from "./dto/GenerateTokensPayload.dto";
import {User} from "../../entities/User/User";

@Injectable()
export class TokenService implements ITokenService {
    constructor(
        @Inject(ITokenRepository) private tokenRepository: ITokenRepository,
        @Inject(IUserRepository) private userRepository: IUserRepository,
    ) {
    }

    generateTokens(payload: GenerateTokensPayloadDto) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '15m',
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '24h',
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    async saveRefreshToken(dto: SaveRefreshTokenDto) {
        const tokenData = await this.tokenRepository.findTokenByUserId(dto.userId)
        if (tokenData) {
            tokenData.refreshToken = dto.refreshToken
            return await this.tokenRepository.updateRefreshToken(tokenData)
        }
        return await this.tokenRepository.saveRefreshToken(
            new Token({
                userId: dto.userId,
                refreshToken: dto.refreshToken,
            }),
        );
    }

    removeToken(refreshToken: string): Promise<boolean> {
        return this.tokenRepository.removeToken(refreshToken)
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


    async refreshToken(refreshToken: string): Promise<{user: User, tokens: { accessToken: string; refreshToken: string; }}> {
        if (!refreshToken) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
        }
        const payload = this.validateRefreshToken(refreshToken)
        const tokenFromDb = await this.tokenRepository.findTokenByRefreshToken(refreshToken)
        if (!payload || !tokenFromDb) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
        }
        const user = await this.userRepository.getUserById(payload.userId)
        const tokens = this.generateTokens({userId: user.id});
        await this.saveRefreshToken({
            userId: user.id,
            refreshToken: tokens.refreshToken,
        });
        return {
            user,
            tokens,
        };
    }
}
