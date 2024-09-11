import { IsAlpha, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}

export class UserRegistrationDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @Length(3, 20, { message: 'Full name must be between 3 and 20 characters' })
  @IsAlpha('en-US', { message: 'Full name must only contain letters' })
  fullName: string;
}
