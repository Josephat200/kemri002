/**
 * String utilities
 */

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const generateSerialNumber = (prefix: string, counter: number): string => {
  return `${prefix}${String(counter).padStart(6, '0')}`;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const truncate = (text: string, length: number = 50): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};
