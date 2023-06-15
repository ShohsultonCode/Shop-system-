import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDTO {
    @IsString()
    @IsNotEmpty()
    user_username: string;

    @IsString()
    @IsNotEmpty()
    user_password: string;
}