import { IsNotEmpty, IsString } from "class-validator";

export class cartDto {
    @IsString()
    @IsNotEmpty()
    cart_product: string;
}
