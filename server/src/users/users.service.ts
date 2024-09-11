import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Response } from 'express';

export type IUser = {
  id: number;
  fullName: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: number): Promise<User | null> {
    return this.userModel.findOne({ _id: id });
  }

  async findOneByEmail({ email }: { email: string }): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async saveRefreshToken(refreshToken: string, res?: Response) {
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
  }
}
