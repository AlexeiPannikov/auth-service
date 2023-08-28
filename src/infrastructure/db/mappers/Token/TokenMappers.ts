import { TokenEntity } from '../../entities/Token/Token.entity';
import { Token } from '../../../../core/entities/Token/Token';

export class TokenMappers {
  static toEntity(domain: Token): TokenEntity {
    const entity = new TokenEntity();
    return Object.assign(entity, domain);
  }

  static toDomain(entity: TokenEntity): Token {
    return new Token({
      userId: entity.userId,
      refreshToken: entity.refreshToken,
      id: entity.id,
    });
  }
}
