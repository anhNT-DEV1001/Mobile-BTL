import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        dbName: config.get<string>('MONGO_DB'),
        replicaSet: config.get<string>('MONGO_REPLICA_SET'),
        authSource: 'admin',
        serverSelectionTimeoutMS: 8000,
        directConnection: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
