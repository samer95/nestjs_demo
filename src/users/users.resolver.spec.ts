import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import {
  CREATE_USER_DTO,
  generateUser,
  UPDATE_USER_DTO,
  UPDATE_USER_PERMISSIONS_DTO,
  USER_PERMISSIONS,
  USERS_DATA,
} from './test-data/users.test-data';
import { getRepositoryToken } from '@nestjs/typeorm';
import { usersRepositoryMock, usersServiceMock } from './test-data/users.test-mocks';
import { User } from './entities/user.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepositoryMock,
        },
        {
          provide: CaslAbilityFactory,
          useValue: {
            createForUser: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const dto = {
        ...CREATE_USER_DTO,
        password_confirmation: CREATE_USER_DTO.password,
      };
      expect(
        await resolver.createUser(dto),
      ).toEqual({
        ...generateUser(USERS_DATA.length + 1, CREATE_USER_DTO),
        id: expect.any(Number),
      });

      expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should get the users array', async () => {
      expect(await resolver.findAll()).toEqual(USERS_DATA);

      expect(usersServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should get one user', async () => {
      expect(
        await resolver.findOne(USERS_DATA[0].id),
      ).toEqual(
        { ...USERS_DATA[0] },
      );

      expect(usersServiceMock.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updatedData = { ...UPDATE_USER_DTO, id: USERS_DATA[0].id };
      expect(
        await resolver.updateUser(updatedData),
      ).toEqual({
        ...USERS_DATA[0],
        ...updatedData,
      });

      expect(usersServiceMock.update).toHaveBeenCalledWith(1, updatedData);
    });
  });

  describe('updateUserPermissions', () => {
    it('should update a user permissions', async () => {
      expect(
        await resolver.updateUserPermissions(UPDATE_USER_PERMISSIONS_DTO),
      ).toEqual(USER_PERMISSIONS);

      expect(usersServiceMock.updatePermissions).toHaveBeenCalledWith(
        UPDATE_USER_PERMISSIONS_DTO,
      );
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      expect(
        await resolver.removeUser(USERS_DATA[0].id),
      ).toEqual(
        { ...USERS_DATA[0] },
      );

      expect(usersServiceMock.remove).toHaveBeenCalledWith(USERS_DATA[0].id);
    });
  });
});
