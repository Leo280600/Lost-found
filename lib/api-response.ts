import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: number) {
  return NextResponse.json({ success: true, data }, { status: init ?? 200 });
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function fail(message: string, status = 400, errors?: unknown) {
  return NextResponse.json({ success: false, message, errors }, { status });
}

export function unauthorized(message = "กรุณาเข้าสู่ระบบ") {
  return fail(message, 401);
}

export function forbidden(message = "คุณไม่มีสิทธิ์เข้าถึง") {
  return fail(message, 403);
}

export function notFound(message = "ไม่พบข้อมูล") {
  return fail(message, 404);
}
