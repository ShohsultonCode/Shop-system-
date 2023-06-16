import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class updateDto {
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

    @IsString()
    @IsNotEmpty()
    user_description: string;


    @IsString()
    @IsNotEmpty()
    user_location: string;
}
