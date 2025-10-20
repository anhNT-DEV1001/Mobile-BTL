import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from './project/schemas/project.schema';
import { Participant, Role } from './project//schemas/participant.schema';
import { ProjectAssignment } from './project//schemas/project-assignment.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const projectModel = app.get<Model<Project>>(getModelToken(Project.name));
  const participantModel = app.get<Model<Participant>>(getModelToken(Participant.name));
  const assignmentModel = app.get<Model<ProjectAssignment>>(getModelToken(ProjectAssignment.name));

  // --- Sample projects ---
  const projectsData = [
    { name: 'Website CoffeeShop', startDate: new Date('2025-01-15'), expectedEndDate: new Date('2025-03-15') },
    { name: 'Mobile App POS', startDate: new Date('2025-02-01'), expectedEndDate: new Date('2025-05-01') },
    { name: 'Internal Dashboard', startDate: new Date('2025-03-01'), expectedEndDate: new Date('2025-04-15') },
  ];

  // --- Sample participants ---
  const participantsData = [
    { fullName: 'Nguyễn Văn A', email: 'a@example.com', roles: [Role.Dev] },
    { fullName: 'Trần Thị B', email: 'b@example.com', roles: [Role.Tester] },
    { fullName: 'Lê Văn C', email: 'c@example.com', roles: [Role.BA, Role.Dev] },
  ];

  // Insert projects if not exists
  for (const p of projectsData) {
    const exists = await projectModel.findOne({ name: p.name }).lean();
    if (!exists) {
      await projectModel.create(p);
      console.log('Inserted project:', p.name);
    } else console.log('Project exists:', p.name);
  }

  // Insert participants if not exists
  for (const u of participantsData) {
    const exists = await participantModel.findOne({ email: u.email }).lean();
    if (!exists) {
      await participantModel.create(u);
      console.log('Inserted participant:', u.email);
    } else console.log('Participant exists:', u.email);
  }

  // Create a few assignments (map by names)
  const project1 = await projectModel.findOne({ name: projectsData[0].name });
  const project2 = await projectModel.findOne({ name: projectsData[1].name });
  const partA = await participantModel.findOne({ email: participantsData[0].email });
  const partB = await participantModel.findOne({ email: participantsData[1].email });
  const partC = await participantModel.findOne({ email: participantsData[2].email });

  const assignments = [
    { participant: partA._id, project: project1._id, joinedAt: new Date('2025-01-20') },
    { participant: partB._id, project: project1._id, joinedAt: new Date('2025-01-25') },
    { participant: partC._id, project: project2._id, joinedAt: new Date('2025-02-05') },
  ];

  for (const a of assignments) {
    const exists = await assignmentModel.findOne({ participant: a.participant, project: a.project }).lean();
    if (!exists) {
      await assignmentModel.create(a);
      console.log('Inserted assignment:', a.participant.toString(), '->', a.project.toString());
    } else console.log('Assignment exists for', a.participant.toString());
  }

  await app.close();
  console.log('Seeding complete.');
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
