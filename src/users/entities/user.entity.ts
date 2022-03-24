import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserTypes } from '../../enums/UserTypes';
import { Genders } from '../../enums/Genders';
import { Languages } from '../../enums/Languages';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  first_name: string;

  @Column()
  @Field()
  last_name: string;

  @Column({ length: 60, unique: true })
  @Field()
  email: string;

  @Column({ length: 60, unique: true, nullable: true })
  @Field({ nullable: true })
  phone?: string;

  @Column()
  @Field()
  password: string;

  @Column({ type: 'timestamptz', nullable: true })
  @Field((type) => GraphQLISODateTime, { nullable: true })
  email_verified_at?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @Field((type) => GraphQLISODateTime, { nullable: true })
  phone_verified_at?: Date;

  @Column({
    type: 'enum',
    enum: UserTypes,
    default: UserTypes.STUDENT,
  })
  @Field()
  user_type: string;

  @Column({ type: 'enum', enum: Genders, nullable: true })
  @Field({ nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  @Field((type) => GraphQLISODateTime, { nullable: true })
  birthdate?: Date;

  @Column({ type: 'int', default: 1 })
  @Field((type) => Int)
  max_facilities_count: number;

  @Column({ type: 'enum', enum: Languages, default: Languages.TR })
  @Field()
  lang: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  about?: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  image?: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Field((type) => GraphQLISODateTime)
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field((type) => GraphQLISODateTime)
  updated_at: Date;
}
