import { SaveRefreshTokenDto } from '../dto/SaveRefreshToken.dto';
import { Token } from '../../../entities/Token/Token';

export interface ITokenService {
  generateTokens(payload: string | object | Buffer): {
    accessToken: string;
    refreshToken: string;
  };
  saveRefreshToken(dto: SaveRefreshTokenDto): Promise<Token>;
}

export const ITokenService = Symbol('ITokenService');
