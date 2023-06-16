import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import mongoose, { Model } from 'mongoose';
import { Category, User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginAuthDTO } from './dto/login.dto';
import UploadedFileInter from './entities/file.catch';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private readonly Users: Model<User>,
    @InjectModel('Categories') private readonly Categories: Model<Category>,
    private jwtService: JwtService,
  ) { }


  async register(body: CreateUserDto): Promise<object> {
    const { user_first_name, user_last_name, user_password, user_username } = body;

    const checkUsername = await this.Users.findOne({
      user_username: user_username.toLowerCase().trim(),
    });

    if (checkUsername) {
      throw new HttpException(
        'This username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(user_password, 10);

    const allCategories = await this.Categories.find();

    const userCategories = allCategories.map((category) => ({
      category: category._id,
      category_status: true,
    }));

    const newUser = new this.Users({
      user_first_name: user_first_name,
      user_last_name: user_last_name,
      user_username: user_username.toLowerCase(),
      user_password: hashPassword,
      user_categories: userCategories,
      user_role: 'user',

    });

    await newUser.save();

    const userId = newUser._id;
    const userRole = newUser.user_role;

    const payload = { id: userId, role: userRole };

    const token = this.jwtService.sign(payload);

    return { message: 'Successfully registered', statusCode: 201, token: token, role: newUser.user_role };
  }

  async login(
    body: LoginAuthDTO,
  ): Promise<object> {
    const { user_username, user_password } = body;

    const checkUsername = await this.Users.findOne({
      user_username: user_username.toLowerCase().trim(),
    });

    if (!checkUsername) {
      throw new HttpException(
        'Invalid  username or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hash = await bcrypt.compare(
      user_password,
      checkUsername.user_password,
    );

    if (!hash) {
      throw new HttpException(
        'Invalid password or username',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = checkUsername._id;
    const userRole = checkUsername.user_role

    const payload = { id: userId, role: userRole };

    const token = await this.jwtService.sign(payload);

    return { message: 'Succsessfuly Login', statusCode: 200, token: token, role: checkUsername.user_role };
  }
  async updateProfile(req: any, body: UpdateAuthDto, file: UploadedFileInter): Promise<object> {
    const { id } = req.user
    const { user_first_name, user_last_name, user_password, user_username, user_description } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }

    const user = await this.Users.findById(id);


    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }


    if (user_first_name) {
      user.user_first_name = user_first_name;
    }
    if (user_description) {
      user.user_description = user_description;
    }

    if (user_last_name) {
      user.user_last_name = user_last_name;
    }

    if (user_username) {
      user.user_username = user_username;
    }

    if (user_password) {
      const hashPassword = await bcrypt.hash(user_password, 10);
      user.user_password = hashPassword;
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
