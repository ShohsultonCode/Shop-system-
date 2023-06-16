import { IsNotEmpty, IsString } from "class-validator";

export class productSeachDto {
    @IsString()
    @IsNotEmpty()
    product_name: string;
}
