import { IsString } from 'class-validator';

export class accessDto {
    @IsString()
    refreshToken: string;
}
