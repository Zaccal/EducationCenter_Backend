import { IsOptional, IsString, IsUrl } from 'class-validator';

export class HomeworkDto {
    @IsUrl()
    @IsString()
    url: string;

    @IsString()
    @IsOptional()
    comment?: string;
}
