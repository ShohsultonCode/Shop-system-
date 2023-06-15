import { IsString, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsString()
    @IsNotEmpty()
    product_description: string;


    @IsNumberString()
    @IsNotEmpty()
    product_count: number;

    @IsString()
    @IsNotEmpty()
    product_category: string;

    @IsNotEmpty()
    @IsNumberString()
    product_price: number;

}
