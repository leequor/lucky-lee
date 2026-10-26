import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  loginAction: vi.fn(),
  registerAction: vi.fn(),
  forgotPasswordAction: vi.fn(),
  resetPasswordAction: vi.fn(),
}));

vi.mock("@/app/actions/auth", () => ({
  loginAction: mocks.loginAction,
  registerAction: mocks.registerAction,
  forgotPasswordAction: mocks.forgotPasswordAction,
  resetPasswordAction: mocks.resetPasswordAction,
}));

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.loginAction.mockResolvedValue({ status: "idle" });
  mocks.registerAction.mockResolvedValue({ status: "idle" });
  mocks.forgotPasswordAction.mockResolvedValue({ status: "idle" });
  mocks.resetPasswordAction.mockResolvedValue({ status: "idle" });
});

describe("LoginForm", () => {
  it("renders labeled fields and the recovery link", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /forgot password/i })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows an error notice passed by the page", () => {
    render(<LoginForm errorNotice="This reset link is invalid." />);

    expect(screen.getByRole("alert")).toHaveTextContent("This reset link is invalid.");
  });

  it("shows a success notice passed by the page", () => {
    render(<LoginForm notice="Password updated." />);

    expect(screen.getByRole("status")).toHaveTextContent("Password updated.");
  });

  it("renders the server action field errors", async () => {
    mocks.loginAction.mockResolvedValue({
      status: "error",
      message: "Email is required.",
      fieldErrors: {
        email: "Email is required.",
        password: "Password is required.",
      },
    });

    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getAllByText("Email is required.").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Password is required.").length).toBeGreaterThan(0);
    });
  });
});

describe("RegisterForm", () => {
  it("renders display name, email, and password fields", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText("Display name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("At least 6 characters")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("shows the confirmation success message", async () => {
    mocks.registerAction.mockResolvedValue({
      status: "success",
      message: "Account created. Check your email.",
    });

    const user = userEvent.setup();
    render(<RegisterForm />);
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Account created.");
    });
  });
});

describe("ForgotPasswordForm", () => {
  it("renders the email field and send control", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("shows the generic success message", async () => {
    mocks.forgotPasswordAction.mockResolvedValue({
      status: "success",
      message: "If an account exists, a reset link is on its way.",
    });

    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("If an account exists");
    });
  });
});

describe("ResetPasswordForm", () => {
  it("requires both password fields", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update password/i })).toBeInTheDocument();
  });

  it("renders a mismatch error from the action", async () => {
    mocks.resetPasswordAction.mockResolvedValue({
      status: "error",
      message: "Passwords do not match.",
      fieldErrors: { confirmPassword: "Passwords do not match." },
    });

    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    await user.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getAllByText("Passwords do not match.").length).toBeGreaterThan(0);
    });
  });
});
