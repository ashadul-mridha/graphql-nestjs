import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import entities from "../../database/entities";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: +configService.get<number>("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        entities: entities,
        synchronize: false,
        migrations: ["dist/database/migrations/*.js"],
        migrationsRun: false,
        autoLoadEntities: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MysqlProvider {}
