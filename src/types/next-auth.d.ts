import "next-auth";

export type Role = {
  roleId: string;
  roleName: string;
};

export interface Person {
  personId: number;
  dni: string;
  names: string;
  surnames: string;
  birthdate: Date;
  phone: string;
  address: string;
}

export interface User {
  userId: number;
  email: string;
  password: string;
  personId: number;
  createdAt: string;
  updatedAt: string;
  person: Person;
}

declare module "next-auth" {
  interface Session {
    roles: Role[];
    user: User;
    token: string;
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    roles: Role[];
    user: User;
    token: string;
  }
}
