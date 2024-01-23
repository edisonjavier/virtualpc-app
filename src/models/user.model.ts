import { Person, Role, User } from "@/types/next-auth";

export interface UserModel {
  user: User;
  person: Person;
  role: Role;
}
