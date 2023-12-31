import { UploadedFile, UseGuards, UseInterceptors, Controller, Get, Post, Put, Body, Param, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDTO } from './dto/login.dto';
import { fileUploadInterceptor } from 'src/utils/file.catch';
import UploadedFileInter from './entities/file.catch';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async singup(@Body() createAuthDto: CreateUserDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  async signin(@Body() LoginDto: LoginAuthDTO) {
    return this.authService.login(LoginDto);
  }


  @Put('update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(fileUploadInterceptor('user_image'))
  async updateProfile(@Req() req: any, @Body() updateAuthDto: UpdateAuthDto, @UploadedFile() file: UploadedFileInter) {
    return this.authService.updateProfile(req, updateAuthDto, file);
  }

  @Get("/profile")
  @UseGuards(JwtAuthGuard)
  async info(@Req() req: any) {
    return this.authService.info(req);
  }

}
