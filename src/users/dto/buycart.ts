import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class BuycartDto {
    @IsArray()
    @IsNotEmpty()
    buy_product: object[];
}
