import { ConflictException, Injectable } from '@nestjs/common';
import { UserLoginDto, UserRegistrationDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login({ email, password }: UserLoginDto) {
    const user = await this.userService.findOneByEmail({ email });
    if (!user) {
      throw new ConflictException('User does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ConflictException('Invalid password');
    }

    const payload = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });

    return { accessToken, refreshToken };
  }

  async register({ fullName, email, password }: UserRegistrationDto) {
    const userWithSameEmail = await this.userService.findOneByEmail({ email });
    if (userWithSameEmail) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      fullName,
      email,
      password: hashedPassword,
      _id: new Types.ObjectId(),
    });
    const savedUser = {
      ...(await newUser.save()).toObject(),
      password: undefined,
    };
    return savedUser;
  }

}
