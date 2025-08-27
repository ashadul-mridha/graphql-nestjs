import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}