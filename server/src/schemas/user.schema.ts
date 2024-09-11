import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop()
  _id: Types.ObjectId;
}
export const UserSchema = SchemaFactory.createForClass(User);
