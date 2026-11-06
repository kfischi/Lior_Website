/**
 * Israeli phone number check, shared by the form (server) and the chat's intake (browser).
 * It lives in its own file so the browser does not have to download the validation library for it.
 */
export const PHONE_PATTERN = /^(?:\+?972|0)[\d\s-]{8,12}$/;

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.trim());
}
