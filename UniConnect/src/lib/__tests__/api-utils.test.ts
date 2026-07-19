import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({
      status: init?.status ?? 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

import { createApiResponse, AuthError, handleAuthError } from "../api-utils";

describe("AuthError", () => {
  it("creates an error with the given message", () => {
    const err = new AuthError("Unauthorized");
    expect(err.message).toBe("Unauthorized");
    expect(err.name).toBe("AuthError");
  });
});

describe("createApiResponse", () => {
  it("creates a JSON response with data", async () => {
    const res = createApiResponse({ test: true });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ test: true });
  });

  it("accepts custom status code", async () => {
    const res = createApiResponse({ error: "not found" }, 404);
    expect(res.status).toBe(404);
  });
});

describe("handleAuthError", () => {
  it("returns 401 for AuthError with Unauthorized message", async () => {
    const err = new AuthError("Unauthorized");
    const res = handleAuthError(err);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 403 for any other AuthError", async () => {
    const err = new AuthError("Forbidden");
    const res = handleAuthError(err);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data).toEqual({ error: "Forbidden" });
  });

  it("returns 500 for non-AuthError", async () => {
    const res = handleAuthError(new Error("something broke"));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Internal server error");
  });
});
