import { describe, it, expect } from "vitest";
import { cn, formatDate, slugify, getInitials, getDaysRemaining, getStatusColor, getStatusLabel } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2025-09-01");
    expect(result).toContain("Sep");
    expect(result).toContain("2025");
  });

  it("formats a Date object", () => {
    const result = formatDate(new Date(2025, 0, 15));
    expect(result).toContain("Jan");
    expect(result).toContain("2025");
  });
});

describe("slugify", () => {
  it("converts text to lowercase slug", () => {
    expect(slugify("University of Engineering")).toBe("university-of-engineering");
  });

  it("removes special characters", () => {
    expect(slugify("FAST-NUCES, Lahore!")).toBe("fast-nuces-lahore");
  });

  it("handles multiple spaces", () => {
    expect(slugify("hello   world")).toBe("hello-world");
  });

  it("trims whitespace", () => {
    expect(slugify("  spaced  ")).toBe("spaced");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("getInitials", () => {
  it("returns initials from full name", () => {
    expect(getInitials("Ahmad Khan")).toBe("AK");
  });

  it("returns single initial for one name", () => {
    expect(getInitials("Ahmad")).toBe("A");
  });

  it("returns ? for null", () => {
    expect(getInitials(null)).toBe("?");
  });

  it("returns ? for undefined", () => {
    expect(getInitials(undefined)).toBe("?");
  });

  it("returns up to 2 characters", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });
});

describe("getDaysRemaining", () => {
  it("returns positive days for future date", () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    expect(getDaysRemaining(future)).toBe(5);
  });

  it("returns negative days for past date", () => {
    const past = new Date();
    past.setDate(past.getDate() - 3);
    const result = getDaysRemaining(past);
    expect(result).toBeLessThan(0);
  });
});

describe("getStatusColor", () => {
  it("returns success color for open", () => {
    expect(getStatusColor("open")).toBe("text-success");
  });

  it("returns warning for closing_soon", () => {
    expect(getStatusColor("closing_soon")).toBe("text-warning");
  });

  it("returns secondary for upcoming", () => {
    expect(getStatusColor("upcoming")).toBe("text-secondary");
  });

  it("returns destructive for closed", () => {
    expect(getStatusColor("closed")).toBe("text-destructive");
  });

  it("returns muted for unknown", () => {
    expect(getStatusColor("unknown")).toBe("text-muted-foreground");
  });
});

describe("getStatusLabel", () => {
  it("labels open status", () => {
    expect(getStatusLabel("open")).toBe("Open");
  });

  it("labels closing_soon status", () => {
    expect(getStatusLabel("closing_soon")).toBe("Closing Soon");
  });

  it("labels upcoming status", () => {
    expect(getStatusLabel("upcoming")).toBe("Upcoming");
  });

  it("labels closed status", () => {
    expect(getStatusLabel("closed")).toBe("Closed");
  });

  it("returns raw value for unknown status", () => {
    expect(getStatusLabel("pending")).toBe("pending");
  });
});
