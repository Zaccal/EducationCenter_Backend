import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class registerDto {
    @IsString()
    @Length(2, 8)
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(8, {
        message: 'Password has to be at least 8 characters long',
    })
    password: string;
}
