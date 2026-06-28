"use server";

export async function verifyAppPassword(password: string): Promise<boolean> {
  const correctPassword = process.env.APP_PASSWORD;
  
  if (!correctPassword) {
    // Sebagai fallback jika .env belum termuat saat dev server tidak direstart
    return password === "rahasia123"; 
  }

  return password === correctPassword;
}
