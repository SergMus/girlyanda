export function hasMinimumPhoneDigits(phone: string): boolean {
  return phone.replace(/\D/g, '').length >= 7;
}
