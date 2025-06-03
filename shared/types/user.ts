export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export type CreateUserDTO = {
  name: string;
  email: string;
};
