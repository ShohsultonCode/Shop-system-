import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  category_name: string;
}
