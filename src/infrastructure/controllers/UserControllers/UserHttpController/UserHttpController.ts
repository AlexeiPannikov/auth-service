import {
    Controller,
    Get,
    Inject,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {IUserService} from '../../../../core/services/UserService/interface/IUserService';
import {ResponseInterceptor} from '../../../interceptors/ResponseInterceptor';
import {UserResponse} from "./responses/UserResponse";

@Controller('users')
@UseInterceptors(ResponseInterceptor)
export class UserHttpController {
    constructor(
        @Inject(IUserService)
        private readonly userService: IUserService,
    ) {
    }

    @UsePipes(new ValidationPipe())
    @Get('get-all-users')
    async getAllUsers() {
        try {
            const users = await this.userService.getAllUsers();
            return {
                users: users.map(user => new UserResponse(user))
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
