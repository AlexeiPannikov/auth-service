import {CreateSessionDto} from "../../../../core/repositories/SessionRepository/dto/CreateSession.dto";
import {Session} from "../../../../core/entities/Session/Session";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {SessionEntity} from "../../entities/Session/Session.entity";
import {SessionMappers} from "../../mappers/Session/SessionMappers";
import {ISessionRepository} from "../../../../core/repositories/SessionRepository/ISessionRepository";

export class SessionRepositoryImpl implements ISessionRepository {

    constructor(
        @InjectRepository(SessionEntity)
        private readonly sessionRepository: Repository<SessionEntity>,
    ) {
    }

    async create(dto: CreateSessionDto): Promise<Session> {
        const entity = new SessionEntity()
        entity.userId = dto.userId
        entity.expiredAt = dto.expiredDate
        const data = await this.sessionRepository.save(entity)
        return SessionMappers.toDomain(data)
    }

    async deleteByUuid(uuid: string): Promise<Session> {
        const entity = await this.sessionRepository.findOneBy({uuid})
        await this.sessionRepository.delete({uuid})
        return SessionMappers.toDomain(entity)
    }

    async updateByUuid(uuid: string, dto: Partial<Session>): Promise<Session> {
        await this.sessionRepository.update({uuid}, dto)
        const entity = await this.sessionRepository.findOneBy({uuid})
        return SessionMappers.toDomain(entity)
    }

    async getSessionByUuid(uuid: string): Promise<Session> {
        const entity = await this.sessionRepository.findOneBy({uuid})
        if (entity) {
            return SessionMappers.toDomain(entity)
        }
    }

}