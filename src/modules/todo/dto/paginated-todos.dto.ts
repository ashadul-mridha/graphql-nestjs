import { Field, ObjectType } from "@nestjs/graphql";
import { TodoEntity } from "../entities/todo.entity";
import { PageInfo } from "./pagination.dto";

@ObjectType()
export class TodoEdge {
  @Field()
  cursor: string;

  @Field(() => TodoEntity)
  node: TodoEntity;
}

@ObjectType()
export class PaginatedTodos {
  @Field(() => [TodoEdge])
  edges: TodoEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}