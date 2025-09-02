import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan, LessThan } from "typeorm";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { UpdateTodoDto } from "../dto/update-todo.dto";
import { PaginationInput } from "../dto/pagination.dto";
import { PaginatedTodos, TodoEdge } from "../dto/paginated-todos.dto";
import { GetTodoOffsetPaginateDto, PaginatedTodosOffset } from "../dto/offset-pagination.dto";
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

  async findAllPaginated(pagination?: PaginationInput): Promise<PaginatedTodos> {
    const { cursor, first, last } = pagination || {};
    const limit = first || last || 10;
    
    let query = this.todoRepository.createQueryBuilder("todo");
    
    if (cursor) {
      const cursorTodo = await this.todoRepository.findOne({ where: { id: cursor } });
      if (!cursorTodo) {
        throw new NotFoundException(`Todo with cursor ID ${cursor} not found`);
      }
      
      if (first) {
        query = query.where("todo.createdAt > :cursorDate", { cursorDate: cursorTodo.createdAt });
        query = query.orderBy("todo.createdAt", "ASC");
      } else if (last) {
        query = query.where("todo.createdAt < :cursorDate", { cursorDate: cursorTodo.createdAt });
        query = query.orderBy("todo.createdAt", "DESC");
      }
    } else {
      query = query.orderBy("todo.createdAt", first ? "ASC" : "DESC");
    }
    
    query = query.limit(limit + 1);
    const todos = await query.getMany();
    
    const hasNextPage = todos.length > limit;
    const hasPreviousPage = Boolean(cursor);
    
    const nodes = hasNextPage ? todos.slice(0, -1) : todos;
    if (last && !cursor) {
      nodes.reverse();
    }
    
    const edges: TodoEdge[] = nodes.map((todo) => ({
      cursor: todo.id,
      node: todo,
    }));
    
    return {
      edges,
      pageInfo: {
        hasNextPage: first ? hasNextPage : false,
        hasPreviousPage: last ? hasNextPage : hasPreviousPage,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
    };
  }

  async findAllWithOffset(pagination?: GetTodoOffsetPaginateDto): Promise<PaginatedTodosOffset> {
    const { currentPage = 1, perPage = 10 } = pagination || {};
    const offset = (currentPage - 1) * perPage;
    
    const [todos, total] = await this.todoRepository.findAndCount({
      skip: offset,
      take: perPage,
      order: { createdAt: "DESC" },
    });
    
    return {
      todos,
      total,
      currentPage,
      perPage,
    };
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
