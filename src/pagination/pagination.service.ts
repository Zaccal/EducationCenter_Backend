import { Injectable } from '@nestjs/common';
import { paginationDto } from './dto/pagination.dto';

@Injectable()
export class PaginationService {
    getPagination(dto: paginationDto, defualtPerPage = 30) {
        const page = dto.page ? +dto.page : 1;
        const perPage = dto.perPage ? +dto.perPage : defualtPerPage;

        const skip = (page - 1) * perPage;

        return { perPage, skip };
    }
}
