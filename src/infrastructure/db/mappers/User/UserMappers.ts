import { User } from '../../../../core/entities/User/User';
import { UserEntity } from '../../entities/User/User.entity';

export class UserMappers {
  static toEntity(domain: Partial<User>): UserEntity {
    const entity = new UserEntity();
    return Object.assign(entity, domain);
  }

  static toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      isActivated: entity.isActivated,
      activationLink: entity.activationLink,
    });
  }
}
