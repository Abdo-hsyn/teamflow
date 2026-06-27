import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: number;
  publicId: string;
  email: string;
}

export interface RefreshTokenPayload extends TokenPayload {
  tokenVersion: number;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  ) as TokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as RefreshTokenPayload;
};