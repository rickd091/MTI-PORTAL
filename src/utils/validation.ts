import { z } from "zod";

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);
export const phoneSchema = z.string().regex(/^\+?[0-9]{10,15}$/);

export const validateEmail = (email: string) => emailSchema.safeParse(email);
export const validatePassword = (password: string) =>
  passwordSchema.safeParse(password);
export const validatePhone = (phone: string) => phoneSchema.safeParse(phone);
