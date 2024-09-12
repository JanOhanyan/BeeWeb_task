import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { workspace } from 'src/schemas/workspace.schemta';
import { UsersService } from 'src/users/users.service';
import { WorkspaceCreateDto } from './dto/workspace.create.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(workspace.name)
    private readonly workspaceModel: Model<workspace>,
  ) {}

  async create({
    name,
    slug,
    userId,
  }: WorkspaceCreateDto & { userId: Types.ObjectId }) {
    const candidate = await this.workspaceModel.findOne({ slug });

    if (candidate) {
      throw new ConflictException('Workspace with this slug already exists');
    }

    const workspace = new this.workspaceModel({
      _id: new Types.ObjectId(),
      name,
      slug,
      userId,
    });
    return await workspace.save();
  }

  async check({ slug }: { slug: string }) {
    const workspace = await this.workspaceModel.findOne({ slug });

    if (workspace) {
      const variants = await this.generateSlugVariants(slug);
      return {
        variants,
        isFree: false,
      };
    }

    return {
      variants: [],
      isFree: true,
    };
  }

  private async generateSlugVariants(slug: string): Promise<string[]> {
    const variants: string[] = [];
    let index = 1;

    while (variants.length < 5) {
      const newSlug = `${slug}${index}`;
      const existing = await this.workspaceModel.findOne({ slug: newSlug });

      if (!existing) {
        variants.push(newSlug);
      }

      index++;
    }

    return variants;
  }

  async getWorspacesByUserId(userId: Types.ObjectId) {
    const workspaces = await this.workspaceModel.find({ userId });

    return workspaces;
  }

  private async getWorkspaceById(id: Types.ObjectId) {
    try {
      const workspace = await this.workspaceModel.findById(id);
      if (!workspace) {
        throw new ForbiddenException('Workspace not found');
      }

      return workspace;
    } catch (error) {
      throw new ForbiddenException('Workspace not found');
    }
  }

  async deleteById({ userId, id }: { userId: Types.ObjectId; id: string }) {
    const workspaceId = new Types.ObjectId(id);
    const workspace = await this.getWorkspaceById(workspaceId);
    if (workspace.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You are not owner of this workspace');
    }

    return await this.workspaceModel.findByIdAndDelete(workspace);
  }
}
