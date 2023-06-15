import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }
  @Get(':filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: './uploads' });
  }
}


