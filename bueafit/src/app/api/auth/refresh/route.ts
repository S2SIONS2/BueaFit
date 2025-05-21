export async function refreshToken(): Promise<{ access_token: string; refresh_token: string }> {
  const refresh_token = localStorage.getItem("refresh_token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "X-Refresh-Token": refresh_token ?? "",
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to refresh token");

  return await res.json();
}