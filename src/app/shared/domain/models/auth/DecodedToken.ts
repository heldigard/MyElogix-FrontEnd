export interface DecodedToken {
  id: number;
  sub: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isLocked: boolean;
  isDeleted: boolean;
  roles: string[];
  exp: number;
}
