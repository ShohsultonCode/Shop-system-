import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional() // Mark the field as optional
    user_first_name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional() // Mark the field as optional
    user_last_name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional() // Mark the field as optional
    user_username?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional() // Mark the field as optional
    user_password?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional() // Mark the field as optional
    user_description?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional() // Mark the field as optional
    user_location?: string;
}
