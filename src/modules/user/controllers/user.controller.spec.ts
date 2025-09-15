import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "../dto/create-user.dto";
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
  };

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

      const result = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalledWith();
      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUsers);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no users exist", async () => {
      const expectedUsers: UserEntity[] = [];

      mockUserService.findAll.mockResolvedValue(expectedUsers);

      const result = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalledWith();
      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle service errors when fetching all users", async () => {
      const error = new Error("Database connection failed");
      mockUserService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(
        "Database connection failed"
      );
      expect(userService.findAll).toHaveBeenCalledWith();
      expect(userService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
