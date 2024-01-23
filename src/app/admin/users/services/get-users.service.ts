import API from "@/lib/axios/api";
import { UserModel } from "@/models/user.model";

export default async function getUsersService() {
  const url = "/user";
  const res = await API.get<UserModel[]>({ url });
  return res;
}
