import jwt from "jsonwebtoken";
import { JwtPayload } from "./auth.service";

export const createToken = (
  jwtPayload: JwtPayload,
  secretToken: string,
  expiry: string, // Allow both string (e.g., "1h") or number (e.g., 3600)
) => {
  return jwt.sign(jwtPayload, secretToken, { expiresIn: expiry });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
