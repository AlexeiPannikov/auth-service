import {User} from "../../../../../core/entities/User/User";

export class UserResponse {
    id: number
    name: string
    email: string
    isActivated: boolean

    constructor(user: User) {
        this.id = user.id
        this.name = user.name
        this.email = user.email
        this.isActivated = user.isActivated
    }
}