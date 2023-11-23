import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { fileUploadInterceptor } from 'src/utils/file.catch';
import UploadedFileInter from 'src/auth/entities/file.catch';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { IsNumber } from 'class-validator';
import { productSeachDto } from 'src/admin/dto/product.seach.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Get('user')
  // @UseGuards(JwtAuthGuard)
  // userById(@Req() req: any) {
  //   return this.usersService.userById(req);
  // }


}



