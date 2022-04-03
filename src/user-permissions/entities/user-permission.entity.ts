import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Action } from '../../common/enums/action.enum';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Unique(['user_id', 'object', 'action'])
@Entity({ name: 'user_permissions' })
export class UserPermission {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  user_id: number;

  @Column()
  @Field()
  object: string;

  @Column({ type: 'enum', enum: Action })
  @Field()
  action: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(type => GraphQLISODateTime)
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(type => GraphQLISODateTime)
  updated_at: Date;

  @ManyToOne(type => User, user => user.permissions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field(type => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User[];
}
