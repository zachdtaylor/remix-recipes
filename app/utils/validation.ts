export function isValidEmail(email: string) {
  if (!email.includes("@") || !email.split("@")[1].includes(".")) {
    return false;
  }
  return true;
}

export function isBlank(value: string | undefined | null) {
  if (typeof value === "string" && value.length === 0) {
    return true;
  }
  return false;
}
