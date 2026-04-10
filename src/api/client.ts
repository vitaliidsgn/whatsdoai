import type { Partner, RegisterResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }

  return res.json();
}

export function registerPartner(email: string, partnerType = "business") {
  return request<RegisterResponse>("/partners/register", {
    method: "POST",
    body: JSON.stringify({ email, partner_type: partnerType }),
  });
}

export function getPartner(partnerId: string) {
  return request<Partner>(`/partners/${partnerId}`);
}

export function updateProfile(
  partnerId: string,
  data: { name: string; phone: string | null }
) {
  return request<Partner>(`/partners/${partnerId}/profile`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function syncLocations(partnerId: string) {
  return request<{ partner_id: string; published: number }>(
    `/partners/${partnerId}/sync-locations`,
    { method: "POST" }
  );
}
