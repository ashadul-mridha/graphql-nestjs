import { HttpException, HttpStatus } from "@nestjs/common";
import * as bcrypt from "bcrypt";

// encrypt password
export async function encryptPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new HttpException(
      error.message,
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

// compare password
export async function comparePassword(password: string, hashPassword: string) {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    throw new HttpException(
      error.message,
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
