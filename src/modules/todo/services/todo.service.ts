import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { UpdateTodoDto } from "../dto/update-todo.dto";
import { TodoEntity } from "../entities/todo.entity";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}

  async create(createTodoInput: CreateTodoDto): Promise<TodoEntity> {
    const todo = this.todoRepository.create(createTodoInput);
    return await this.todoRepository.save(todo);
  }

  async findAll(): Promise<TodoEntity[]> {
    return await this.todoRepository.find();
  }

  async findOne(id: string): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: string, updateTodoInput: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoInput);
    return await this.todoRepository.save(todo);
  }

  async remove(id: string): Promise<TodoEntity> {
    const todo = await this.findOne(id);
    await this.todoRepository.remove(todo);
    return todo;
  }
}
