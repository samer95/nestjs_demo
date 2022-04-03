import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Block } from '../../blocks/entities/block.entity';

@Entity({ name: 'transactions' })
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  block_id: number;

  @Column({ type: 'text' })
  @Field(() => String)
  t_hash: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(type => GraphQLISODateTime)
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(type => GraphQLISODateTime)
  updated_at: Date;

  @Field(type => Block, { nullable: true })
  @JoinColumn({ name: 'block_id' })
  block: Block[];
}
