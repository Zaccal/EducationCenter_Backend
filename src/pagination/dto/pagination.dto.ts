import { IsOptional, IsString } from 'class-validator';

export class paginationDto {
    @IsString()
    @IsOptional()
    page?: number;

    @IsString()
    @IsOptional()
    perPage: number;
}
