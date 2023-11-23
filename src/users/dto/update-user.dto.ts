import { PartialType } from '@nestjs/mapped-types';
import { updatePordu } from './updateproduct';

export class UpdateProductDto extends PartialType(updatePordu) { }
