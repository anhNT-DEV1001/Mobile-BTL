import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { Participant, ParticipantDocument } from './schemas/participant.schema';
import { ProjectAssignment, ProjectAssignmentDocument } from './schemas/project-assignment.schema';
import { CreateProjectDto , CreateParticipantDto , CreateAssignmentDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Participant.name) private participantModel: Model<ParticipantDocument>,
    @InjectModel(ProjectAssignment.name) private assignmentModel: Model<ProjectAssignmentDocument>,
  ) {}

  // Projects
  async createProject(dto: CreateProjectDto) {
    const p = await this.projectModel.create({
      name: dto.name,
      startDate: new Date(dto.startDate),
      expectedEndDate: new Date(dto.expectedEndDate),
    });
    return p;
  }

  async listProjects() {
    return this.projectModel.find().sort({ startDate: 1 }).lean();
  }

  // Participants
  async createParticipant(dto: CreateParticipantDto) {
    const exists = await this.participantModel.findOne({ email: dto.email }).lean();
    if (exists) throw new BadRequestException('Email đã tồn tại');
    return this.participantModel.create(dto);
  }

  async listParticipants() {
    return this.participantModel.find().sort({ fullName: 1 }).lean();
  }

  // Assignments (dự án triển khai)
  async createAssignment(dto: CreateAssignmentDto) {
    // validate ids
    if (!Types.ObjectId.isValid(dto.participantId) || !Types.ObjectId.isValid(dto.projectId)) {
      throw new BadRequestException('ParticipantId hoặc ProjectId không hợp lệ');
    }

    const participant = await this.participantModel.findById(dto.participantId);
    if (!participant) throw new NotFoundException('Participant không tồn tại');

    const project = await this.projectModel.findById(dto.projectId);
    if (!project) throw new NotFoundException('Project không tồn tại');

    // upsert: tránh duplicate (schema có index unique)
    try {
      const created = await this.assignmentModel.create({
        participant: participant._id,
        project: project._id,
        joinedAt: new Date(dto.joinedAt),
      });
      return created;
    } catch (err) {
      // duplicate key
      if (err?.code === 11000) throw new BadRequestException('Assignment đã tồn tại');
      throw err;
    }
  }

  /**
   * Lấy danh sách assignments (DS dự án triển khai)
   * query options:
   *  - search: tìm theo participant fullName (partial, case-insensitive)
   *  - role: filter theo role (Dev/Tester/BA)
   *  - projectId: filter theo project
   *  - sort: 'asc' | 'desc' (joinedAt)
   *  - page, limit: pagination
   */
  async listAssignments(opts: {
    search?: string;
    role?: string;
    projectId?: string;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const { search, role, projectId, sort = 'desc', page = 1, limit = 20 } = opts;

    const skip = (page - 1) * limit;

    // Build aggregate pipeline để filter theo participant fields + role + project
    const pipeline: any[] = [
      // join participant
      {
        $lookup: {
          from: 'participants',
          localField: 'participant',
          foreignField: '_id',
          as: 'participantDoc',
        },
      },
      { $unwind: '$participantDoc' },
      // join project
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'projectDoc',
        },
      },
      { $unwind: '$projectDoc' },
    ];

    const match: any = {};

    if (projectId && Types.ObjectId.isValid(projectId)) {
      match['project'] = new Types.ObjectId(projectId);
    }

    if (search) {
      // search in participant fullName (case-insensitive)
      match['participantDoc.fullName'] = { $regex: search, $options: 'i' };
    }

    if (role) {
      // roles is array of strings on participantDoc.roles
      match['participantDoc.roles'] = role;
    }

    if (Object.keys(match).length) pipeline.push({ $match: match });

    // project results shape
    pipeline.push({
      $project: {
        _id: 1,
        joinedAt: 1,
        'participant._id': '$participantDoc._id',
        'participant.fullName': '$participantDoc.fullName',
        'participant.email': '$participantDoc.email',
        'participant.roles': '$participantDoc.roles',
        'project._id': '$projectDoc._id',
        'project.name': '$projectDoc.name',
        'project.startDate': '$projectDoc.startDate',
        'project.expectedEndDate': '$projectDoc.expectedEndDate',
      },
    });

    // sort by joinedAt
    pipeline.push({ $sort: { joinedAt: sort === 'asc' ? 1 : -1 } });

    // count total (clone pipeline)
    const countPipeline = pipeline.concat([{ $count: 'total' }]);
    const countRes = await this.assignmentModel.aggregate(countPipeline);
    const total = countRes[0]?.total ?? 0;

    // add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    const docs = await this.assignmentModel.aggregate(pipeline);
    return { total, page, limit, data: docs };
  }

  /**
   * Thống kê: lấy danh sách participant cho 1 project, sắp xếp theo joinedAt
   */
  async getParticipantsByProject(projectId: string, sort: 'asc' | 'desc' = 'asc') {
    if (!Types.ObjectId.isValid(projectId)) throw new BadRequestException('projectId không hợp lệ');

    const pipeline: PipelineStage[] = [
      { $match: { project: new Types.ObjectId(projectId) } },
      {
        $lookup: {
          from: 'participants',
          localField: 'participant',
          foreignField: '_id',
          as: 'participantDoc',
        },
      },
      { $unwind: '$participantDoc' },
      {
        $project: {
          joinedAt: 1,
          'participant._id': '$participantDoc._id',
          'participant.fullName': '$participantDoc.fullName',
          'participant.email': '$participantDoc.email',
          'participant.roles': '$participantDoc.roles',
        },
      },
      { $sort: { joinedAt: sort === 'asc' ? 1 : -1 } },
    ];

    return this.assignmentModel.aggregate(pipeline);
  }

  // helpers: seed (tự động chèn một số dữ liệu mẫu)
  // async seedSampleData() {
  //   const projects = [
  //     { name: 'Website CoffeeShop', startDate: new Date('2025-01-15'), expectedEndDate: new Date('2025-03-15') },
  //     { name: 'Mobile POS', startDate: new Date('2025-02-01'), expectedEndDate: new Date('2025-05-01') },
  //     { name: 'Internal Dashboard', startDate: new Date('2025-03-01'), expectedEndDate: new Date('2025-04-15') },
  //   ];
  //   const participants = [
  //     { fullName: 'Nguyễn Văn A', email: 'a@example.com', roles: ['Dev'] },
  //     { fullName: 'Trần Thị B', email: 'b@example.com', roles: ['Tester'] },
  //     { fullName: 'Lê Văn C', email: 'c@example.com', roles: ['BA', 'Dev'] },
  //   ];

  //   for (const p of projects) {
  //     await this.projectModel.updateOne({ name: p.name }, { $setOnInsert: p }, { upsert: true });
  //   }
  //   for (const u of participants) {
  //     await this.participantModel.updateOne({ email: u.email }, { $setOnInsert: u }, { upsert: true });
  //   }

  //   // create some assignments
  //   const proj1 = await this.projectModel.findOne({ name: projects[0].name });
  //   const proj2 = await this.projectModel.findOne({ name: projects[1].name });
  //   const partA = await this.participantModel.findOne({ email: participants[0].email });
  //   const partB = await this.participantModel.findOne({ email: participants[1].email });
  //   const partC = await this.participantModel.findOne({ email: participants[2].email });

  //   const assigns = [
  //     { participant: partA._id, project: proj1._id, joinedAt: new Date('2025-01-20') },
  //     { participant: partB._id, project: proj1._id, joinedAt: new Date('2025-01-25') },
  //     { participant: partC._id, project: proj2._id, joinedAt: new Date('2025-02-05') },
  //   ];

  //   for (const a of assigns) {
  //     try {
  //       await this.assignmentModel.updateOne(
  //         { participant: a.participant, project: a.project },
  //         { $setOnInsert: a },
  //         { upsert: true },
  //       );
  //     } catch (err) {
  //       // ignore duplicates
  //     }
  //   }

  //   return { ok: true };
  
}
