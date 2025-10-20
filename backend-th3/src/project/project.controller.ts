import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto , CreateParticipantDto , CreateAssignmentDto } from './dto/project.dto';

@Controller('api')
export class ProjectController {
  constructor(private readonly svc: ProjectService) {}

  // --- projects ---
  @Post('projects')
  createProject(@Body() dto: CreateProjectDto) {
    return this.svc.createProject(dto);
  }

  @Get('projects')
  listProjects() {
    return this.svc.listProjects();
  }

  // --- participants ---
  @Post('participants')
  createParticipant(@Body() dto: CreateParticipantDto) {
    return this.svc.createParticipant(dto);
  }

  @Get('participants')
  listParticipants() {
    return this.svc.listParticipants();
  }

  // --- assignments (dự án triển khai) ---
  @Post('assignments')
  createAssignment(@Body() dto: CreateAssignmentDto) {
    return this.svc.createAssignment(dto);
  }

  /**
   * List assignments with filters.
   * Query params:
   *  - search (participant name)
   *  - role (Dev|Tester|BA)
   *  - projectId
   *  - sort (asc|desc) default desc
   *  - page, limit
   */
  @Get('assignments')
  listAssignments(
    @Query('search') search: string,
    @Query('role') role: string,
    @Query('projectId') projectId: string,
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.svc.listAssignments({
      search,
      role,
      projectId,
      sort,
      page: Number(page),
      limit: Number(limit),
    });
  }

  // --- stats: participants by project ---
  @Get('projects/:projectId/participants')
  getParticipantsByProject(@Param('projectId') projectId: string, @Query('sort') sort: 'asc'|'desc'='asc') {
    return this.svc.getParticipantsByProject(projectId, sort);
  }

  // seed helper (dev only)
  // @Post('seed')
  // seed() {
  //   return this.svc.seedSampleData();
  // }
}
