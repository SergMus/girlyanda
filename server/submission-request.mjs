export const RECIPIENT = 'umt1@ukr.net';

export function textField(data, key, maxLength) {
  const value = data.get(key);

  if (typeof value !== 'string' || value.length > maxLength) {
    return '';
  }

  return value.trim();
}
