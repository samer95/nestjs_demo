import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../../common/enums/user-type.enum';
import { Gender } from '../../common/enums/gender.enum';
import { Language } from '../../common/enums/language.enum';
import { Certificate } from '../../certificates/entities/certificate.entity';
import { UserPermission } from '../../user-permissions/entities/user-permission.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  certificate_id: number;

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
  @Field(type => GraphQLISODateTime, { nullable: true })
  email_verified_at?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @Field(type => GraphQLISODateTime, { nullable: true })
  phone_verified_at?: Date;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.STUDENT,
  })
  @Field()
  user_type: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  @Field({ nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  @Field(type => GraphQLISODateTime, { nullable: true })
  birthdate?: Date;

  @Column({ type: 'int', default: 1 })
  @Field(type => Int)
  max_facilities_count: number;

  @Column({ type: 'enum', enum: Language, default: Language.TR })
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

  @Column({ type: 'bool', default: false })
  @Field(type => Boolean)
  is_admin: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  @Field(type => GraphQLISODateTime)
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(type => GraphQLISODateTime)
  updated_at: Date;

  @ManyToOne(type => Certificate, certificate => certificate.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field(type => Certificate, { nullable: true })
  @JoinColumn({ name: 'certificate_id' })
  certificate: Certificate[];

  @OneToMany(() => UserPermission, userPermission => userPermission.user)
  @Field(() => [UserPermission], { nullable: true })
  permissions: UserPermission[];
}
