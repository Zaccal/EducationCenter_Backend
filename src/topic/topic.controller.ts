import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { EnumRole } from '@prisma/client';
import { Auth } from 'src/decarators/auth.decarator';
import { Role } from 'src/decarators/role.decarator';
import { setRole } from 'src/decarators/setRole.decarator';
import { CreateTopicDto } from './dto/create-topic.dto';
import { sortTopicDto } from './dto/sort-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
    constructor(private readonly topicService: TopicService) {}

    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createTopicDto: CreateTopicDto) {
        return await this.topicService.create(createTopicDto);
    }

    @Get()
    @Auth()
    async findAll(@Query() dto: sortTopicDto) {
        return await this.topicService.findAll(dto);
    }

    @Get(':id')
    @Auth()
    async findOne(@Param('id') id: string) {
        return await this.topicService.findOne(id);
    }

    @Role()
    @setRole(EnumRole.ADMIN)
    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async update(
        @Param('id') id: string,
        @Body() updateTopicDto: UpdateTopicDto,
    ) {
        return await this.topicService.update(id, updateTopicDto);
    }

    @Role()
    @setRole(EnumRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.topicService.remove(id);
    }
}
