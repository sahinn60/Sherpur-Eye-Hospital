import jwt from "jsonwebtoken";
import { JwtPayload, UserRole } from "../types";
import { config } from "../config/env";

export function signToken(userId: string, role: UserRole): string {
  return jwt.sign({ userId, role } satisfies JwtPayload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
}
