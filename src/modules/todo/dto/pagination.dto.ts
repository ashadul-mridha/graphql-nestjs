import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsString, IsInt, Min, ValidateIf } from "class-validator";

@InputType()
export class PaginationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cursor?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ValidateIf((o) => !o.last)
  first?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ValidateIf((o) => !o.first)
  last?: number;
}

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;
}