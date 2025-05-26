import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

export const createToken = (
  jwtPayload: {
    email: string;
    user: string;
    role: string;
  },
  secretToken: string,
  expiry: string | number, // Allow both string (e.g., "1h") or number (e.g., 3600)
) => {
  const options: SignOptions = {
    expiresIn: expiry, // Cast to match expected type
  };
  return jwt.sign(jwtPayload, secretToken, options);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
