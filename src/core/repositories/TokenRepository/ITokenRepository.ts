import { Token } from '../../entities/Token/Token';

export interface ITokenRepository {
  findTokenByUserId(userId: number): Promise<Token>;

  saveRefreshToken(dto: Token): Promise<Token>;

  updateRefreshToken(dto: Token): Promise<Token>;
}

export const ITokenRepository = Symbol('ITokenRepository');
