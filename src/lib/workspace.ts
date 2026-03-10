/** Generate a random alphanumeric code (uppercase, 6 chars). */
function generateCode6(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I,O,0,1 for clarity
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Generate a random alphanumeric join code (uppercase, 6 chars). */
export const generateJoinCode = generateCode6;

/** Generate a 6-character uppercase team code for companies. */
export const generateTeamCode = generateCode6;

/** Normalize join code for lookup (uppercase, trim). */
export function normalizeJoinCode(code: string): string {
  return code.trim().toUpperCase();
}
