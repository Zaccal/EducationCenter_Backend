import { IsString } from 'class-validator';

export class createDto {
    @IsString()
    comment: string;
}
