import { IsOptional, IsString, IsUrl } from 'class-validator';

export class patchDto {
    @IsOptional()
    @IsUrl()
    @IsString()
    url: string;

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;
}
