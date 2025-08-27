import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { UpdateTodoDto } from "../dto/update-todo.dto";
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

  @Query(() => [TodoEntity], { name: "todos" })
  findAll(): Promise<TodoEntity[]> {
    return this.todoService.findAll();
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
