import { NextResponse } from "next/server";

export function response(data: object, status: number = 200) {
  return NextResponse.json(data, { status });
}
