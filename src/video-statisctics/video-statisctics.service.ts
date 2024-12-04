import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { YouTubeVideoResponse } from './types/statistics.type';

@Injectable()
export class VideoStatiscticsService {
    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
    ) {}

    async getVideoStatisctics(videoLink: string) {
        const API_KEY = this.configService.get<string>('GOOGLE_CLOUD_API_KEY');
        const VIDEO_ID = this.getVideoId(videoLink);

        if (!VIDEO_ID) {
            throw new BadRequestException(
                "Video link is incorect, couldn't get video ID",
            );
        }

        if (!API_KEY) {
            throw new BadRequestException('Google cloud api key is required');
        }

        const url = `https://www.googleapis.com/youtube/v3/videos?id=${VIDEO_ID}&part=statistics&key=${API_KEY}`;
        const response = await this.httpService
            .get<YouTubeVideoResponse>(url)
            .toPromise();

        return response.data.items[0].statistics;
    }

    private getVideoId(link: string) {
        const regex =
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = link.match(regex);
        return match ? match[1] : null;
    }
}
