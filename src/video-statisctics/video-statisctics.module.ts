import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { VideoStatiscticsService } from './video-statisctics.service';

@Module({
    controllers: [],
    providers: [VideoStatiscticsService],
    exports: [VideoStatiscticsService],
    imports: [HttpModule],
})
export class VideoStatiscticsModule {}
