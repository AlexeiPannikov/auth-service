import { Token } from '../../entities/Token/Token';

export interface ITokenRepository {
  findTokenByUserId(userId: number): Promise<Token>;

  saveRefreshToken(dto: Token): Promise<Token>;

  updateRefreshToken(dto: Token): Promise<Token>;

  removeToken(refreshToken: string): Promise<boolean>;
}

export const ITokenRepository = Symbol('ITokenRepository');
