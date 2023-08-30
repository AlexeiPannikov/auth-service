import {SaveRefreshTokenDto} from '../dto/SaveRefreshToken.dto';
import {Token} from '../../../entities/Token/Token';
import {GenerateTokensPayloadDto} from "../dto/generateTokensPayload.dto";
import {User} from "../../../entities/User/User";

export interface ITokenService {
    generateTokens(payload: GenerateTokensPayloadDto): {
        accessToken: string;
        refreshToken: string;
    };

    saveRefreshToken(dto: SaveRefreshTokenDto): Promise<Token>;

    removeToken(refreshToken: string): Promise<boolean>

    refreshToken(refreshToken: string): Promise<{ user: User, tokens: { accessToken: string; refreshToken: string; } }>

    validateRefreshToken(token: string): GenerateTokensPayloadDto

    validateAccessToken(token: string): GenerateTokensPayloadDto
}

export const ITokenService = Symbol('ITokenService');
