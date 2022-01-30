import crypto from "crypto";

if (typeof process.env.ENCRYPTION_SECRET_KEY !== "string") {
  throw new Error("Missing env var `ENCRYPTION_SECRET_KEY`");
}

const ivLength = 16;
const algorithm = "aes-256-ctr";
const secretKey = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_SECRET_KEY)
  .digest();

export function encrypt(value: string) {
  const initializationVector = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(
    algorithm,
    secretKey,
    initializationVector
  );
  const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
  return `${initializationVector.toString("hex")}.${encrypted.toString("hex")}`;
}

export function decrypt(value: string) {
  const [ivPart, encryptedPart] = value.split(".");
  if (!ivPart || !encryptedPart) {
    throw new Error("invalid value provided to `decrypt`");
  }
  const initializationVector = Buffer.from(ivPart, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    initializationVector
  );
  const encrypted = Buffer.from(encryptedPart, "hex");
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString();
}

export function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
