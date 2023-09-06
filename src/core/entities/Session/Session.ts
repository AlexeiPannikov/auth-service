export class Session {
    id: number;
    uuid: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    expiredAt: string;

    constructor(obj?: Partial<Session>) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
}