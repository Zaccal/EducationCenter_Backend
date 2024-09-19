import { IsBoolean } from 'class-validator';

export class BanDto {
    @IsBoolean()
    isBanned: boolean;
}
