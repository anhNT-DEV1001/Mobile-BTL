import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                const host = config.get<string>('db.host');
                return {
                    uri: `mongodb://${host}`,
                    dbName: config.get<string>('db.name'),
                    replicaSet: config.get<string>('db.replica'),
                    authSource: 'admin',
                    serverSelectionTimeoutMS: 5000,
                    directConnection: false
                }
            }
        })
    ],
})
export class DatabaseModule { }
