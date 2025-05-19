import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (
  jwtPayload: {
    email: string;
    user: string;
    role: string;
  },
  secretToken: string,
  expiry: string,
) => {
  return jwt.sign(jwtPayload, secretToken, {
    expiresIn: expiry,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
