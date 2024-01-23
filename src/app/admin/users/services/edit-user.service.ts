import API from "@/lib/axios/api";
import { UserSchema } from "../components/form-user";

export default async function editUserService(userSchema: UserSchema) {
  const url = `/user/user-person/${userSchema.user.userId}`;
  const res = await API.patch<{ success: boolean }>({ url, data: userSchema });
  return res;
}
