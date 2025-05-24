import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a slug from a given string by:
 * 1. Converting to lowercase
 * 2. Replacing spaces and special characters with hyphens
 * 3. Removing leading/trailing hyphens
 * 4. Removing duplicate hyphens
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Format a date as a string in the format 'Month Day, Year'
 */
export function formatDate(date: Date | number): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a price with currency symbol
 */
export function formatPrice(
  price: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(price);
}

// Export formatCurrency as an alias for formatPrice for backward compatibility
export const formatCurrency = formatPrice;
