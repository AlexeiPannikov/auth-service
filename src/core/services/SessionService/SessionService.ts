import {Inject, Injectable} from "@nestjs/common";
import {ISessionRepository} from "../../repositories/SessionRepository/ISessionRepository";
import {ISessionService} from "./interface/ISessionService";
import {Session} from "../../entities/Session/Session";
import {CreateSessionDto} from "./dto/CreateSession.dto";
import {addDays} from "../../helpers/AddDays";
import {CronJob} from "cron"

@Injectable()
export class SessionService implements ISessionService {
    constructor(
        @Inject(ISessionRepository) private sessionRepository: ISessionRepository
    ) {
    }

    runOldSessionsCleaner() {
        const job = new CronJob(
            '0 15 * * *',
            function() {
                console.log('Sessions cleaner has been ran');
            },
            null,
            true,
            null,
            null,
            true
        );
        job.start()
    }

    async create(dto: CreateSessionDto): Promise<Session> {
        const expiredDate = addDays(new Date().toISOString(), 1).getTime().toString()
        return await this.sessionRepository.create({...dto, expiredDate})
    }

    async deleteByUuid(uuid: string): Promise<Session> {
        return await this.sessionRepository.deleteByUuid(uuid)
    }

    async updateByUuid(uuid: string, dto?: Partial<Session>): Promise<Session> {
        const expiredDate = addDays(new Date().toISOString(), 1).getTime().toString()
        return await this.sessionRepository.updateByUuid(
            uuid,
            dto
                ? {
                    ...dto,
                    expiredAt: expiredDate
                }
                : {expiredAt: expiredDate})
    }

    async getSessionByUuid(uuid: string): Promise<Session> {
        return await this.sessionRepository.getSessionByUuid(uuid)
    }
}