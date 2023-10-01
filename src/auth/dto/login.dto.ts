import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    user_email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(10)
    user_password: string;
}