import { Role } from '../schemas/participant.schema';


export class CreateProjectDto {
  readonly name: string;
  readonly startDate: string | Date;
  readonly expectedEndDate: string | Date;
}


export class CreateParticipantDto {
  readonly fullName: string;
  readonly email: string;
  readonly roles?: Role[]; // ['Dev', 'Tester', ...]
}

export class CreateAssignmentDto {
  readonly participantId: string;
  readonly projectId: string;
  readonly joinedAt: string | Date;
}
