import { Controller, Get, Param } from '@nestjs/common';
import { CountService } from './count.service';
import { EnumCountGetObject } from './dto/countGet.dto';

@Controller('count')
export class CountController {
    constructor(private countService: CountService) {}

    @Get('/:object')
    async getCount(@Param('object') object: EnumCountGetObject) {
        return await this.countService.getCount(object);
    }
}
