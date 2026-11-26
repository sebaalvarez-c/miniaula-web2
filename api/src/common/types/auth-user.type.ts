export interface AuthUser {
  id: string;
  email: string;
  rol: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  rol: string;
}
