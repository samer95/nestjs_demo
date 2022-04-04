import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
@InputType()
class SingleTransaction {
  @Field()
  hash: string;

  @Field(() => Float)
  balance_from: number;

  @Field(() => Float)
  balance_to: number;
}

@InputType()
export class CreateBlockInput {
  @Field()
  @Expose()
  @IsString()
  @IsNotEmpty()
  b_hash: string;

  @Field(() => Int)
  @Expose()
  @IsInt()
  @IsNotEmpty()
  b_number: number;

  @Field(() => [SingleTransaction])
  @Expose()
  @IsNotEmpty()
  @IsArray()
  transactions: SingleTransaction[];
}
