import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { EnumRole } from '@prisma/client';
import { Auth } from 'src/decarators/auth.decarator';
import { Role } from 'src/decarators/role.decarator';
import { setRole } from 'src/decarators/setRole.decarator';
import { CurrentUser } from 'src/decarators/user.decarator';
import { BanDto } from './dto/ban.dto';
import { updateDto } from './dto/update.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Auth()
    @Get('/:id')
    async getProfile(@Param('id') id: string) {
        return await this.userService.getProfile(id);
    }

    @Auth()
    @UsePipes(new ValidationPipe())
    @Patch('/:id')
    async updateProfile(
        @Body() dto: updateDto,
        @Param('id') id: string,
        @CurrentUser('id') currentUserId: number,
    ) {
        return await this.userService.updateProfile(id, currentUserId, dto);
    }

    @Role()
    @setRole(EnumRole.ADMIN)
    @UsePipes(new ValidationPipe())
    @Patch('/ban/:id')
    async banUser(@Body() dto: BanDto, @Param('id') id: string) {
        return await this.userService.toggleBan(id, dto.isBanned);
    }
}
