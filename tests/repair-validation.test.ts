import { describe, expect, it } from "vitest";

import {
  hasErrors,
  isDeviceCategory,
  isTicketPriority,
  isTicketStatus,
  parseMoneyToCents,
  parseWholeNumber,
  readOptionalString,
  readString,
  validateEmailAddress,
  validateNewCustomer,
  validateNewDevice,
  validatePart,
  validatePhone,
} from "@/lib/repair/validation";

function formData(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("repair validation", () => {
  it("reads trimmed form values", () => {
    const data = formData({ name: "  Maya  ", empty: "  " });
    expect(readString(data, "name")).toBe("Maya");
    expect(readString(data, "missing")).toBe("");
    expect(readOptionalString(data, "empty")).toBeNull();
  });

  it("parses money and whole numbers", () => {
    expect(parseMoneyToCents("$1,234.56")).toBe(123456);
    expect(parseMoneyToCents("0")).toBe(0);
    expect(parseMoneyToCents("")).toBe(0);
    expect(parseMoneyToCents("-3")).toBeNull();
    expect(parseMoneyToCents("not money")).toBeNull();
    expect(parseWholeNumber("12")).toBe(12);
    expect(parseWholeNumber("")).toBe(0);
    expect(parseWholeNumber("1.2")).toBeNull();
    expect(parseWholeNumber("-1")).toBeNull();
  });

  it("guards enums", () => {
    expect(isTicketStatus("in_repair")).toBe(true);
    expect(isTicketStatus("closed")).toBe(false);
    expect(isTicketPriority("urgent")).toBe(true);
    expect(isTicketPriority("now")).toBe(false);
    expect(isDeviceCategory("laptop")).toBe(true);
    expect(isDeviceCategory("fridge")).toBe(false);
  });

  it("validates email, phone, customer, and device input", () => {
    expect(validateEmailAddress("")).toBeNull();
    expect(validateEmailAddress("maya@example.com")).toBeNull();
    expect(validateEmailAddress("nope")).toBeTruthy();
    expect(validatePhone("")).toBeTruthy();
    expect(validatePhone("123")).toBeTruthy();
    expect(validatePhone("415-555-0142")).toBeNull();

    expect(
      validateNewCustomer({ fullName: "Maya", phone: "415-555-0142", email: "maya@example.com" }),
    ).toEqual({});
    expect(validateNewCustomer({ fullName: "", phone: "1", email: "bad" })).toEqual({
      fullName: "Customer name is required.",
      phone: "Enter a phone number with at least 7 digits.",
      email: "Enter a valid email address.",
    });
    expect(validateNewDevice({ category: "phone", brand: "Apple", model: "15" })).toEqual({});
    expect(validateNewDevice({ category: "fridge", brand: "", model: "" })).toEqual({
      category: "Choose a device type.",
      brand: "Brand is required.",
      model: "Model is required.",
    });
  });

  it("validates parts and reports whether errors exist", () => {
    const valid = validatePart({
      sku: "SKU-1",
      name: "Screen",
      stock: "3",
      reorderLevel: "2",
      cost: "10",
      price: "20",
    });
    expect(valid.errors).toEqual({});
    expect(valid.data).toEqual({ stock: 3, reorderLevel: 2, cost: 1000, price: 2000 });

    const invalid = validatePart({
      sku: "",
      name: "",
      stock: "x",
      reorderLevel: "-1",
      cost: "bad",
      price: "bad",
    });
    expect(Object.keys(invalid.errors)).toHaveLength(6);
    expect(hasErrors(invalid.errors)).toBe(true);
    expect(hasErrors({})).toBe(false);
  });
});
