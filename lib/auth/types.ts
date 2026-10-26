export type AppRole = "superadmin" | "admin" | "user";

export type AuthFieldErrors = Partial<
  Record<"email" | "password" | "confirmPassword", string>
>;

export type AuthState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: AuthFieldErrors;
};

export const initialAuthState: AuthState = {
  status: "idle",
};

export type AuthUser = {
  id: string;
  email: string;
  role: AppRole;
  fullName: string | null;
  createdAt: string | null;
};
