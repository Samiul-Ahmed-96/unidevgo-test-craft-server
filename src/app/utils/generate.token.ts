import crypto from "crypto";

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour
  return { resetToken, resetTokenExpires };
};
