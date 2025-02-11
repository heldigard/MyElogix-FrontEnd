export interface UserDTO {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  isLocked?: boolean;
  isDeleted?: boolean;
  roles?: Set<string>;
}
