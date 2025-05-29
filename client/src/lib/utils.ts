import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string | number, currency: string = "ICP"): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `${numPrice.toFixed(2)} ${currency}`;
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getCategoryDisplayName(category: string): string {
  const categories: Record<string, string> = {
    batik: "Batik",
    wood_sculpture: "Wood Sculpture",
    textile: "Textile",
    mask: "Traditional Mask",
  };
  return categories[category] || category;
}

export function generateTokenId(): string {
  return `PUS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isValidWalletAddress(address: string): boolean {
  // Simple validation for ICP addresses (mock)
  return /^0x[a-fA-F0-9]{40}$/.test(address) || /^[a-z0-9-]{27,63}$/.test(address);
}
