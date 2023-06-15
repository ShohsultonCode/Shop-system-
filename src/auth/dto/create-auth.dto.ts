import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
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
