import { EnumEstimation, EnumStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumSort {
    NEWEST = 'newest',
    OLDEST = 'oldest',
}

export class getAllDto {
    @IsOptional()
    @IsString()
    searchTerm?: string;

    @IsEnum(EnumStatus)
    @IsOptional()
    status?: EnumStatus;

    @IsEnum(EnumEstimation)
    @IsOptional()
    estimation?: EnumEstimation;

    @IsEnum(EnumSort)
    @IsOptional()
    sort?: EnumSort;
}
