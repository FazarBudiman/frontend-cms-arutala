import { ApiResponse } from "@/types/api";
import { CreateMitraInput, Mitra } from "@/types/mitra";

export async function fetchMitras(): Promise<Mitra[]> {
  const res = await fetch("/api/mitras", {
    credentials: "include",
    cache: "no-store",
  });
  const json: ApiResponse<Mitra[]> = await res.json();
  if (!json.success) {
    throw new Error(json.message);
  }
  return json.data ?? [];
}

/* ---------- POST ---------- */
export async function createMitra(formData: FormData) {
  const res = await fetch("/api/mitras", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return res.json();
}

/* ---------- UPDATE ---------- */
export async function updateMitra(id: string, data: CreateMitraInput) {
  const formData = new FormData();

  formData.append("mitraName", data.mitraName);

  data.businessField.forEach((item) => {
    formData.append("businessField", item.value);
  });

  if (data.mitraLogo) {
    formData.append("mitraLogo", data.mitraLogo);
  }

  const res = await fetch(`/api/mitras/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData, // ✅ kirim FormData
  });

  return res.json();
}

/* ---------- DELETE ---------- */
export async function deleteMitra(mitraId: string): Promise<ApiResponse<null>> {
  const res = await fetch("/api/mitras", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mitraId }),
  });

  return res.json();
}
