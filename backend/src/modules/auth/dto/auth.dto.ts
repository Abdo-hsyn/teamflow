export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailDTO {
  token: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface AuthTokensDTO {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDTO {
  user: {
    publicId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    isEmailVerified: boolean;
  };
  tokens: AuthTokensDTO;
}