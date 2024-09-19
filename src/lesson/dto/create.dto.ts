import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateDto {
    @IsString()
    @IsUrl()
    url: string;

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description: string;
}
