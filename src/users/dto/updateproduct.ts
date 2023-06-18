import { IsString, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class updatePordu {
    @IsString()
    product_name: string;

    @IsString()
    product_description: string;


    @IsNumberString()
    product_count: number;

    @IsString()
    product_category: string;

    @IsNumberString()
    product_price: number;

}
