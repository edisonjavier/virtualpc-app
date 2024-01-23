import API from "@/lib/axios/api";

export async function deleteUserService(userId: number) {
  const url = `/user/${userId}`;
  const res = await API.del<{ success: boolean }>({ url });
  return res;
}
