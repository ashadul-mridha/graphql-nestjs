import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserEntity } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import { UserController } from "./user.controller";

describe("UserController", () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as jest.MockedObjectDeep<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const createUserDto: CreateUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        address: "123 Main St, City, Country",
      };

      const expectedResult: UserEntity = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        address: "123 Main St, City, Country",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      };

      mockUserService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it("should handle service errors when creating user", async () => {
      const createUserDto: CreateUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        address: "123 Main St, City, Country",
      };

      const error = new Error("Database connection failed");
      mockUserService.create.mockRejectedValue(error);

      await expect(controller.create(createUserDto)).rejects.toThrow(
        "Database connection failed"
      );
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(userService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      const expectedUsers: UserEntity[] = [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          address: "123 Main St, City, Country",
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        {
          id: "123e4567-e89b-12d3-a456-426614174001",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1234567891",
          address: "456 Oak Ave, City, Country",
          createdAt: new Date("2024-01-02T00:00:00.000Z"),
          updatedAt: new Date("2024-01-02T00:00:00.000Z"),
        },
      ];

      mockUserService.findAll.mockResolvedValue(expectedUsers);

      const result: UserEntity[] = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalledWith();
      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUsers);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no users exist", async () => {
      const expectedUsers: UserEntity[] = [];

      mockUserService.findAll.mockResolvedValue(expectedUsers);

      const result: UserEntity[] = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalledWith();
      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle service errors when fetching all users", async () => {
      const error: Error = new Error("Database connection failed");
      mockUserService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(
        "Database connection failed"
      );
      expect(userService.findAll).toHaveBeenCalledWith();
      expect(userService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("should return a user by id", async () => {
      const userId: string = "123e4567-e89b-12d3-a456-426614174000";
      const expectedUser: UserEntity = {
        id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        address: "123 Main St, City, Country",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      };

      mockUserService.findOne.mockResolvedValue(expectedUser);

      const result: UserEntity = await controller.findOne(userId);

      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUser);
    });

    it("should handle service errors when finding user by id", async () => {
      const userId: string = "non-existent-id";
      const error: NotFoundException = new NotFoundException(
        `User with ID ${userId} not found`
      );

      mockUserService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(userId)).rejects.toThrow(
        NotFoundException
      );
      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(userService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const userId: string = "123e4567-e89b-12d3-a456-426614174000";
      const updateUserDto: UpdateUserDto = {
        name: "Updated John Doe",
        email: "updated.john@example.com",
      };
      const expectedUser: UserEntity = {
        id: userId,
        name: "Updated John Doe",
        email: "updated.john@example.com",
        phone: "+1234567890",
        address: "123 Main St, City, Country",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T12:00:00.000Z"),
      };

      mockUserService.update.mockResolvedValue(expectedUser);

      const result: UserEntity = await controller.update(userId, updateUserDto);

      expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUser);
    });

    it("should handle service errors when updating user", async () => {
      const userId: string = "non-existent-id";
      const updateUserDto: UpdateUserDto = {
        name: "Updated Name",
      };
      const error: NotFoundException = new NotFoundException(
        `User with ID ${userId} not found`
      );

      mockUserService.update.mockRejectedValue(error);

      await expect(controller.update(userId, updateUserDto)).rejects.toThrow(
        NotFoundException
      );
      expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(userService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("remove", () => {
    it("should remove a user", async () => {
      const userId: string = "123e4567-e89b-12d3-a456-426614174000";
      const expectedUser: UserEntity = {
        id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        address: "123 Main St, City, Country",
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      };

      mockUserService.remove.mockResolvedValue(expectedUser);

      const result: UserEntity = await controller.remove(userId);

      expect(userService.remove).toHaveBeenCalledWith(userId);
      expect(userService.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUser);
    });

    it("should handle service errors when removing user", async () => {
      const userId: string = "non-existent-id";
      const error: NotFoundException = new NotFoundException(
        `User with ID ${userId} not found`
      );

      mockUserService.remove.mockRejectedValue(error);

      await expect(controller.remove(userId)).rejects.toThrow(
        NotFoundException
      );
      expect(userService.remove).toHaveBeenCalledWith(userId);
      expect(userService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
