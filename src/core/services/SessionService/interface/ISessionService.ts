import {Session} from "../../../entities/Session/Session";
import {CreateSessionDto} from "../dto/CreateSession.dto";

export interface ISessionService {
    create(dto: CreateSessionDto): Promise<Session>
    updateByUuid(uuid: string, dto?: Partial<Session>): Promise<Session>
    getSessionByUuid(uuid: string): Promise<Session>
    deleteByUuid(uuid: string): Promise<Session>
}

export const ISessionService = Symbol("ISessionService")