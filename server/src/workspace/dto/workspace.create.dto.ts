import { IsAlpha, IsNotEmpty, Length, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class WorkspaceCreateDto {
  @IsNotEmpty()
  @Length(3, 100)
  slug: string;

  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 50)
  name: string;
}
