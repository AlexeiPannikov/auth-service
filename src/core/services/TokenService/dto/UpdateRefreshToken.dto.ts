export interface UpdateRefreshTokenDto {
    userId: number;
    oldRefreshToken: string;
    newRefreshToken: string;
}