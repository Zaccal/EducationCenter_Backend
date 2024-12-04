export interface YouTubeVideoResponse {
    kind: string;
    etag: string;
    items: YouTubeVideo[];
    pageInfo: PageInfo;
}

export interface YouTubeVideo {
    kind: string;
    etag: string;
    id: string;
    statistics: Statistics;
}

export interface Statistics {
    viewCount: string;
    likeCount?: string;
    dislikeCount?: string;
    favoriteCount?: string;
    commentCount?: string;
}

export interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
}
