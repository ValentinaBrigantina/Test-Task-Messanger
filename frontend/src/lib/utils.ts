import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('Authorization')
  if (!token) {
    throw new Error('Authorization token is missing')
  }
  return {
    headers: {
      ...(token && { Authorization: token }),
    },
  }
}
