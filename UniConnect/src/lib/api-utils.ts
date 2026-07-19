import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { canAccess, type Resource, type Action } from "@/lib/permissions";

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  instituteId?: string | null;
};

export async function getAuthUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return {
    id: (session.user as any).id,
    email: session.user.email!,
    name: session.user.name ?? null,
    role: (session.user as any).role ?? "STUDENT",
    instituteId: (session.user as any).instituteId,
  };
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new AuthError("Unauthorized");
  }
  return user;
}

export async function requireRole(...roles: string[]): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new AuthError("Forbidden: insufficient permissions");
  }
  return user;
}

export async function requirePermission(resource: Resource, action: Action): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!canAccess(user.role, resource, action)) {
    throw new AuthError("Forbidden: insufficient permissions");
  }
  return user;
}

export function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function createApiResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
