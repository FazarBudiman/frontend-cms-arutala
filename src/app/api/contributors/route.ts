import { ResponseError, ResponseSuccess } from "@/lib/http/response";
import { NextRequest } from "next/server";

const API_EXTERNAL = process.env.NEXT_API_EXTERNAL!;

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  const res = await fetch(`${API_EXTERNAL}/contributors?type=internal`, {
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });
  const json = await res.json();

  if (!res.ok) {
    return ResponseError(json.message ?? "Failed to fetch data", json.status);
  }

  return ResponseSuccess(json.data, json.message);
}
