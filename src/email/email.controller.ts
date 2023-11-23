
import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('auth')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('/send-code')
  async sendVerificationCode(@Body() body: { email: string }) {
    const code = '123456'; // Generate or retrieve the verification code
    await this.emailService.sendCodeEmail(body.email, code);
    return { message: 'Code sent successfully' };
  }
}
