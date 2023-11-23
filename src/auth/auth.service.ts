import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginAuthDTO } from './dto/login.dto';
import UploadedFileInter from './entities/file.catch';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private readonly Users: Model<User>,
    private jwtService: JwtService,
  ) { }


  //Authrazations


  //Start Register 
  async register(body: RegisterDto): Promise<object> {
    const { user_first_name, user_last_name, user_password, user_username, user_email } = body;

    const checkUsername = await this.Users.findOne({
      user_username: user_username.toLowerCase().trim(),
    });


    if (checkUsername) {
      throw new HttpException(
        'This username already exists',
        HttpStatus.FOUND,
      );
    }


    //Hash Password
    const hashPassword = await bcrypt.hash(user_password, 10);


    const newUser = await new this.Users({
      ...body,
      user_password: hashPassword,
      user_role: "user"
    });



    await newUser.save();


    const payload = { id: newUser._id, role: newUser.user_role };

    const token = this.jwtService.sign(payload);

    return { message: 'Successfully registered', statusCode: 201, token: token, role: newUser.user_role };
  }
  //End Register



  //Start Login

  async login(body: LoginAuthDTO): Promise<object> {
    const { user_email, user_password } = body;

    const checkUsername = await this.Users.findOne({
      user_email: user_email
    });

    if (!checkUsername) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.NOT_FOUND,
      );
    }

    const hash = await bcrypt.compare(
      user_password,
      checkUsername.user_password,
    );

    if (!hash) {
      throw new HttpException(
        'Invalid password or username',
        HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      );
    }


    const payload = { id: checkUsername._id, role: checkUsername.user_role };

    const token = this.jwtService.sign(payload);

    return { message: 'Succsessfuly Login', statusCode: 200, token: token, role: checkUsername.user_role };
  }

  //End Login 



  async updateProfile(req: any, body: UpdateDto, file: UploadedFileInter): Promise<object> {
    const { id } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }

    const user = await this.Users.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updateFields = ['user_first_name', 'user_last_name', 'user_password', 'user_username', 'user_location', 'user_description'];

    // Loop through the updateFields and update corresponding properties if they exist in the request body
    for (const field of updateFields) {
      if (body[field]) {
        user[field] = body[field];
      }
    }

    if (file) {
      user.user_image = file.filename;
    }

    await user.save();

    return { message: 'Profile updated successfully', statusCode: 200 };
  }


  async info(req): Promise<Object> {
    const { id } = req.user;
    const findUser = await this.Users.findById(id);

    if (!findUser) {
      throw new HttpException(
        'User not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { message: "Success", statusCode: 200, data: findUser }
  }


}
