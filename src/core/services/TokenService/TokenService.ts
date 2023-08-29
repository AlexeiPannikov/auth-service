import { ITokenRepository } from '../../repositories/TokenRepository/ITokenRepository';
import * as jwt from 'jsonwebtoken';
import * as process from 'process';
import { SaveRefreshTokenDto } from './dto/SaveRefreshToken.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ITokenService } from './interface/ITokenService';
import { Token } from '../../entities/Token/Token';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    @Inject(ITokenRepository) private tokenRepository: ITokenRepository,
  ) {}

  generateTokens(payload: string | object | Buffer) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
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
}
