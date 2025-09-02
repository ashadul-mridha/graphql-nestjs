import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { UpdateTodoDto } from "../dto/update-todo.dto";
import { PaginationInput } from "../dto/pagination.dto";
import { PaginatedTodos } from "../dto/paginated-todos.dto";
import { GetTodoOffsetPaginateDto, PaginatedTodosOffset } from "../dto/offset-pagination.dto";
import { TodoEntity } from "../entities/todo.entity";
import { TodoService } from "../services/todo.service";

@Resolver(() => TodoEntity)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Mutation(() => TodoEntity)
  createTodo(
    @Args("createTodoInput") createTodoInput: CreateTodoDto
  ): Promise<TodoEntity> {
    return this.todoService.create(createTodoInput);
  }

  @Query(() => PaginatedTodos, { name: "todos" })
  findAll(
    @Args("pagination", { nullable: true }) pagination?: PaginationInput
  ): Promise<PaginatedTodos> {
    return this.todoService.findAllPaginated(pagination);
  }

  @Query(() => PaginatedTodosOffset, { name: "todosOffset" })
  findAllOffset(
    @Args("pagination", { nullable: true }) pagination?: GetTodoOffsetPaginateDto
  ): Promise<PaginatedTodosOffset> {
    return this.todoService.findAllWithOffset(pagination);
  }

  @Query(() => TodoEntity, { name: "todo" })
  findOne(@Args("id", { type: () => ID }) id: string): Promise<TodoEntity> {
    return this.todoService.findOne(id);
  }

  @Mutation(() => TodoEntity)
  updateTodo(
    @Args("updateTodoInput") updateTodoInput: UpdateTodoDto
  ): Promise<TodoEntity> {
    return this.todoService.update(updateTodoInput.id, updateTodoInput);
  }

  @Mutation(() => TodoEntity)
  removeTodo(@Args("id", { type: () => ID }) id: string): Promise<TodoEntity> {
    return this.todoService.remove(id);
  }
}
