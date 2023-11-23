import { IsNotEmpty, IsString } from "class-validator";

export class contactDto {
    @IsString()
    @IsNotEmpty()
    user_first_name: string;


    @IsString()
    @IsNotEmpty()
    user_last_name: string;


    @IsString()
    @IsNotEmpty()
    user_subject: string;


    @IsString()
    @IsNotEmpty()
    user_message: string;
}
