import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findById(id: Types.ObjectId): Promise<User | null> {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    return user;
  }

  async findOneByEmail({ email }: { email: string }): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }
}
