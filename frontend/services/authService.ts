import { apiFetch } from "@/services/apiClient";

/** Shared login used by every role's Quick Sign In button on the sign-in page. */
export async function login(email: string, password: string): Promise<{ role: string; name: string }> {
  return apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function logout(): Promise<void> {
  return apiFetch("/api/auth/logout", { method: "POST" });
}
