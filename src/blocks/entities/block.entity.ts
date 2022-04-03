import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity({ name: 'blocks' })
@ObjectType()
export class Block {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'text' })
  @Field(() => String)
  b_hash: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  b_number: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(type => GraphQLISODateTime)
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(type => GraphQLISODateTime)
  updated_at: Date;

  @OneToMany(() => Transaction, transaction => transaction.block)
  @Field(() => [Transaction], { nullable: true })
  transactions: Transaction[];
}
