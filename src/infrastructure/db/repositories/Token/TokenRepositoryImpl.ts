import { ITokenRepository } from '../../../../core/repositories/TokenRepository/ITokenRepository';
import { Token } from '../../../../core/entities/Token/Token';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from '../../entities/Token/Token.entity';
import { TokenMappers } from '../../mappers/Token/TokenMappers';

export class TokenRepositoryImpl implements ITokenRepository {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  async findTokenByUserId(userId: number): Promise<Token> {
    const token = await this.tokenRepository.findOneBy({ userId });
    return TokenMappers.toDomain(token);
  }

  async saveRefreshToken(dto: Token): Promise<Token> {
    const entity = TokenMappers.toEntity(dto);
    const tokenEntity = await this.tokenRepository.save(entity);
    return TokenMappers.toDomain(tokenEntity);
  }

  async updateRefreshToken(dto: Token): Promise<Token> {
    const entity = TokenMappers.toEntity(dto);
    await this.tokenRepository.update(
      { userId: dto.userId, id: dto.id },
      entity,
    );
    return entity;
  }
}
