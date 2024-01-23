import API from "@/lib/axios/api";
import { UserSchema } from "../components/form-user";

export default async function createUserService(userSchema: UserSchema) {
  const url = "/auth/register";
  const res = await API.post<UserSchema>({ url, data: userSchema });
  return res;
}
