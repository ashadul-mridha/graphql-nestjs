import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsInt, Min } from "class-validator";
import { TodoEntity } from "../entities/todo.entity";

@InputType()
export class GetTodoOffsetPaginateDto {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  currentPage?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  perPage?: number;
}

@ObjectType()
export class PaginatedTodosOffset {
  @Field(() => [TodoEntity])
  todos: TodoEntity[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  perPage: number;
}