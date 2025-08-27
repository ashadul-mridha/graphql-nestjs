import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoEntity } from "./entities/todo.entity";
import { TodoResolver } from "./resolvers/todo.resolver";
import { TodoService } from "./services/todo.service";

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {}
