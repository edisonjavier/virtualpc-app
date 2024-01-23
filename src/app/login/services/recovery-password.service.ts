import API from "@/lib/axios/api";
import { RecoveryPasswordSchema } from "../components/form-recovery-password";

export default async function recoveryPasswordService({ email }: RecoveryPasswordSchema) {
  const url = "/auth/recovery-password";
  return await API.post<{ success: string }>({ url, data: { email } });
}
