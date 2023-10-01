import { IsString, IsNotEmpty, IsArray, MinLength, MaxLength, IsEmail, IsLowercase } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    user_first_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    user_last_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @IsLowercase()
    user_username: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(30)
    @IsLowercase()
    user_email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(10)
    user_password: string;
}
