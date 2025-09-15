import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { envVariable } from './config';
import { HealthController } from './modules/health/health.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './common/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [envVariable]
    }),
    DatabaseModule,
    UserModule,
    AuthModule
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // guard check login
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,   // guard check role
    },
  ],
})
export class AppModule { }
