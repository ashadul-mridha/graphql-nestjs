// generate6DigitOtp
export const generate6DigitOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// generateRandomString
export const generateRandomString = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toUpperCase();
};

export function getDeterministicString(num: number): string {
  // Use the number as a seed for consistent results
  const letters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let result = '';

  // Simple deterministic "random" string generation
  for (let i = 0; i < 8; i++) {
    const pseudoRandomIndex = (num * (i + 1) * 12345) % letters.length;
    result += letters.charAt(pseudoRandomIndex);
  }

  return result;
}
