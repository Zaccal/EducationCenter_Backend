import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class updateDto {
    @IsOptional()
    @IsString()
    firsName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsEmail()
    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(8, {
        message: 'Password must be at least 8 characters',
    })
    password: string;
}
