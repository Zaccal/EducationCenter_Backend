import { IsEnum, IsOptional, IsString } from 'class-validator';
import { paginationDto } from 'src/pagination/dto/pagination.dto';

export enum EnumSort {
    DEFUALT = 'defualt',
    DATE_HIGHIEST = 'date_highiest',
    DATE_LOWIEST = 'date_lowiest',
    ALPHABETICAL_HIGHIEST = 'alphabetical_highiest',
    ALPHABETICAL_LOWIEST = 'alphabetical_lowiest',
}

export class getAllDto extends paginationDto {
    @IsEnum(EnumSort)
    @IsOptional()
    sort: EnumSort = EnumSort.DEFUALT;

    @IsString()
    @IsOptional()
    searchTerm: string;
}
