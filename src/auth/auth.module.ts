import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import UsersSchema from 'src/models/users.schema';
import { SharedModule } from 'src/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import CategorySchema from 'src/models/categpries.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Users', schema: UsersSchema },
      { name: 'Categories', schema: CategorySchema }
    ]),
    SharedModule,
    JwtModule.register({
      global: true,
      secret: '$2a$12$ofKffPiGvvVOE21ClTRo1OJPPgA6HpX3/jIHoTPBopb/cIcZ2r9g2',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
