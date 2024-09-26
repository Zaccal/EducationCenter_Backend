import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EnumSort } from 'src/lesson/dto/getAll.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { sortTopicDto } from './dto/sort-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicService {
    constructor(
        private prisma: PrismaService,
        private paginationService: PaginationService,
    ) {}
    private topic = this.prisma.topic;

    async create(dto: CreateTopicDto) {
        return await this.topic.create({
            data: dto,
        });
    }

    async findAll(dto: sortTopicDto) {
        const { searchTerm, sort } = dto;
        const { perPage, skip } = this.paginationService.getPagination(dto);

        const orderInput: Prisma.TopicOrderByWithRelationInput[] = [];

        if (sort === EnumSort.DATE_HIGHIEST) {
            orderInput.push({
                createdAt: 'asc',
            });
        } else if (sort === EnumSort.DATE_LOWIEST) {
            orderInput.push({
                createdAt: 'desc',
            });
        } else if (sort === EnumSort.ALPHABETICAL_HIGHIEST) {
            orderInput.push({
                title: 'asc',
            });
        } else if (sort === EnumSort.ALPHABETICAL_LOWIEST) {
            orderInput.push({
                title: 'desc',
            });
        }

        return await this.topic.findMany({
            where: {
                title: {
                    contains: searchTerm || '',
                    mode: 'insensitive',
                },
            },
            orderBy: orderInput,
            take: perPage,
            skip,
        });
    }

    async findOne(id: string) {
        const topicFound = await this.topic.findFirst({
            where: {
                id: +id,
            },
        });

        if (!topicFound) throw new NotFoundException('Topic not found');

        return topicFound;
    }

    async update(id: string, updateTopicDto: UpdateTopicDto) {
        await this.findOne(id);

        return await this.topic.update({
            where: {
                id: +id,
            },
            data: updateTopicDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return await this.topic.delete({
            where: {
                id: +id,
            },
        });
    }
}
