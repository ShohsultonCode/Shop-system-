import { IsString, IsNotEmpty, IsArray, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(10)
    user_first_name: string;

    @IsString()
    @IsNotEmpty()
    user_last_name: string;

    @IsString()
    @IsNotEmpty()
    user_username: string;

    @IsString()
    @IsNotEmpty()
    user_password: string;
}
