import { ChangePasswordSchema } from "@/components/form-change-password";
import API from "@/lib/axios/api";

interface ChangePasswordServiceProps {
  userId: number;
  changePasswordSchema: ChangePasswordSchema;
}

export default async function changePasswordService({
  userId,
  changePasswordSchema
}: ChangePasswordServiceProps) {
  const url = `/auth/change-password/${userId}`;
  const res = await API.patch<{ success: boolean }>({ url, data: changePasswordSchema });
  return res;
}
