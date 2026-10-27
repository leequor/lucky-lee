import {
  DEVICE_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type DeviceCategory,
  type TicketPriority,
  type TicketStatus,
} from "./types";

export type FormErrors = Record<string, string>;

export function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function readOptionalString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value || null;
}

export function parseMoneyToCents(value: string) {
  const normalized = value.replace(/[$,\s]/g, "");
  if (!normalized) return 0;
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

export function parseWholeNumber(value: string) {
  if (!value.trim()) return 0;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) return null;
  return number;
}

export function isTicketStatus(value: string): value is TicketStatus {
  return (TICKET_STATUSES as readonly string[]).includes(value);
}

export function isTicketPriority(value: string): value is TicketPriority {
  return (TICKET_PRIORITIES as readonly string[]).includes(value);
}

export function isDeviceCategory(value: string): value is DeviceCategory {
  return (DEVICE_CATEGORIES as readonly string[]).includes(value);
}

export function validateEmailAddress(value: string) {
  if (!value) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : "Enter a valid email address.";
}

export function validatePhone(value: string) {
  if (!value) return "Phone number is required.";
  if (value.replace(/\D/g, "").length < 7) {
    return "Enter a phone number with at least 7 digits.";
  }
  return null;
}

export function validateNewCustomer(input: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const errors: FormErrors = {};
  if (!input.fullName) errors.fullName = "Customer name is required.";
  const phoneError = validatePhone(input.phone);
  if (phoneError) errors.phone = phoneError;
  const emailError = validateEmailAddress(input.email);
  if (emailError) errors.email = emailError;
  return errors;
}

export function validateNewDevice(input: {
  category: string;
  brand: string;
  model: string;
}) {
  const errors: FormErrors = {};
  if (!isDeviceCategory(input.category)) errors.category = "Choose a device type.";
  if (!input.brand) errors.brand = "Brand is required.";
  if (!input.model) errors.model = "Model is required.";
  return errors;
}

export function validatePart(input: {
  sku: string;
  name: string;
  stock: string;
  reorderLevel: string;
  cost: string;
  price: string;
}) {
  const errors: FormErrors = {};
  if (!input.sku) errors.sku = "SKU is required.";
  if (!input.name) errors.name = "Part name is required.";

  const stock = parseWholeNumber(input.stock);
  const reorder = parseWholeNumber(input.reorderLevel);
  const cost = parseMoneyToCents(input.cost);
  const price = parseMoneyToCents(input.price);

  if (stock === null) errors.stock = "Stock must be a whole number.";
  if (reorder === null) errors.reorderLevel = "Reorder level must be a whole number.";
  if (cost === null) errors.cost = "Cost must be a positive amount.";
  if (price === null) errors.price = "Price must be a positive amount.";

  return {
    errors,
    data: {
      stock: stock ?? 0,
      reorderLevel: reorder ?? 0,
      cost: cost ?? 0,
      price: price ?? 0,
    },
  };
}

export function hasErrors(errors: FormErrors) {
  return Object.keys(errors).length > 0;
}
