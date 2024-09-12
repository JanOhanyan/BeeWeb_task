import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WorkspaceDocument = HydratedDocument<workspace>;

@Schema()
export class workspace {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  slug: string;

  @Prop()
  _id: Types.ObjectId;
}
export const WorkspaceSchema = SchemaFactory.createForClass(workspace);
