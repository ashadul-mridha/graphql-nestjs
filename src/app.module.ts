import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { AppController } from "./app.controller";
import { TodoModule } from "./modules/todo/todo.module";
import { MysqlProvider } from "./providers/database/mysql.provider";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: "/graphql",
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    MysqlProvider,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TodoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
