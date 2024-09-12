import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { MongooseModule } from '@nestjs/mongoose';
import { workspace, WorkspaceSchema } from 'src/schemas/workspace.schemta';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: workspace.name, schema: WorkspaceSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, UsersService, JwtStrategy],
})
export class WorkspaceModule {}
