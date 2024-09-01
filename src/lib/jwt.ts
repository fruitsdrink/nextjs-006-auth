import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn: string | number;
}

const DEFAULT_SIGN_OPTIONS: SignOption = {
  expiresIn: "1d",
};
export function signJwt(
  payload: JwtPayload,
  option: SignOption = DEFAULT_SIGN_OPTIONS
): string {
  const secretKey = process.env.JWT_USER_ID_SECRET!;

  const token = jwt.sign(payload, secretKey);

  return token;
}

export function verifyJwt(token: string): JwtPayload | null {
  const secretKey = process.env.JWT_USER_ID_SECRET!;

  try {
    const payload = jwt.verify(token, secretKey) as JwtPayload;
    return payload;
  } catch (error) {
    return null;
  }
}
