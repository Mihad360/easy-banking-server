import jwt from "jsonwebtoken";

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
