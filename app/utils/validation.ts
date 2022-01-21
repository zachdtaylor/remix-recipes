export function isValidEmail(email: string) {
  if (!email.includes("@") || !email.split("@")[1].includes(".")) {
    return false;
  }
  return true;
}
