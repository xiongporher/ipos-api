import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const DEFAULT_SIGN_OPTION: SignOptions = {
  expiresIn: "1h",
};

export const generateAccessToken = (
  payload: JwtPayload,
  options: SignOptions = DEFAULT_SIGN_OPTION
): string => {
  const secret_key = process.env.JWT_SECRET_KEY;

  if (!secret_key) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }

  const token = jwt.sign(payload, secret_key, options);
  return token;
};