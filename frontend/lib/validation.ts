export const namePattern = /^[\p{L}\p{M}\s'.-]+$/u;
export const locationPattern = /^[\p{L}\p{M}\p{N}\s,.'#/-]+$/u;
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function validateInternationalName(value: string, label = "Name") {
  const trimmed = value.trim();
  if (trimmed.length < 2 || trimmed.length > 80) return `${label} must be between 2 and 80 characters`;
  if (!namePattern.test(trimmed)) return `${label} contains unsupported characters`;
  return "";
}

export function validateInternationalLocation(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length > 120) return "Location is too long";
  if (!locationPattern.test(trimmed)) return "Location contains unsupported characters";
  return "";
}

export function validateEmail(value: string) {
  return emailPattern.test(value.trim()) ? "" : "Enter a valid email";
}
