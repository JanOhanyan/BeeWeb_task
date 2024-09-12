import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { WorkspaceCreateDto } from './dto/workspace.create.dto';
import { Request } from 'express';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: Request,
    @Body() workspaceCreateBody: WorkspaceCreateDto,
  ) {
    const user = req.user as any;
    return await this.workspaceService.create({
      ...workspaceCreateBody,
      userId: user._id,
    });
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  async check(@Req() req: Request, @Query('slug') slug: string) {
    return await this.workspaceService.check({ slug });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async get(@Req() req: Request) {
    const user = req.user as any;
    return await this.workspaceService.getWorspacesByUserId(user._id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    console.log(user);
    return await this.workspaceService.deleteById({ userId: user._id, id });
  }
}
