import {SessionEntity} from "../../entities/Session/Session.entity";
import {Session} from "../../../../core/entities/Session/Session";

export class SessionMappers {
    static toEntity(dto: Session): SessionEntity {
        const entity = new SessionEntity()
        return Object.assign(entity, dto)
    }

    static toDomain(dto: SessionEntity): Session {
        const domain = new Session()
        return Object.assign(domain, dto)
    }
}