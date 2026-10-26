import { describe, expect, it } from "vitest";

import {
  normalizeEmail,
  validateEmail,
  validateLogin,
  validatePassword,
  validateRegistration,
  validateResetPassword,
} from "@/lib/auth/validation";

describe("email validation", () => {
  it("normalizes whitespace and case", () => {
    expect(normalizeEmail("  User@Example.COM ")).toBe("user@example.com");
  });

  it("rejects an empty email", () => {
    expect(validateEmail("")).toBe("Email is required.");
  });

  it("rejects a malformed email", () => {
    expect(validateEmail("not-an-email")).toBe("Please enter a valid email address.");
  });

  it("accepts a normal email", () => {
    expect(validateEmail("user@example.com")).toBeNull();
  });
});

describe("password validation", () => {
  it("requires a password", () => {
    expect(validatePassword("")).toBe("Password is required.");
  });

  it("rejects a password shorter than six characters", () => {
    expect(validatePassword("abc")).toBe("Password must be at least 6 characters long.");
  });

  it("accepts six characters", () => {
    expect(validatePassword("abcdef")).toBeNull();
  });
});

describe("registration validation", () => {
  it("returns field errors for empty input", () => {
    const result = validateRegistration({ email: "", password: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.email).toBe("Email is required.");
      expect(result.fieldErrors.password).toBe("Password is required.");
    }
  });

  it("returns normalized data for valid input", () => {
    const result = validateRegistration({
      email: " User@Example.com ",
      password: "secret123",
    });

    expect(result).toEqual({
      ok: true,
      data: { email: "user@example.com", password: "secret123" },
    });
  });
});

describe("login validation", () => {
  it("does not enforce the registration password length on login", () => {
    const result = validateLogin({ email: "user@example.com", password: "abc" });

    expect(result.ok).toBe(true);
  });

  it("requires a password", () => {
    const result = validateLogin({ email: "user@example.com", password: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.password).toBe("Password is required.");
    }
  });
});

describe("reset password validation", () => {
  it("rejects a mismatch", () => {
    const result = validateResetPassword({
      password: "secret123",
      confirmPassword: "secret456",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.confirmPassword).toBe("Passwords do not match.");
    }
  });

  it("accepts matching passwords", () => {
    expect(
      validateResetPassword({
        password: "secret123",
        confirmPassword: "secret123",
      }),
    ).toEqual({ ok: true, data: { password: "secret123" } });
  });
});
