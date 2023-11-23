import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-auth.dto';
import { updateDto } from './update.to';

export class UpdateAuthDto extends PartialType(updateDto) { }
