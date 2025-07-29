export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;

  const firstChar = local[0];
  const masked = '*'.repeat(Math.max(local.length - 1, 1));
  return `${firstChar}${masked}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  const visibleStart = phone.slice(0, 3); // First 3 digits
  const visibleEnd = phone.slice(-2);     // Last 2 digits
  const masked = '*'.repeat(Math.max(phone.length - 5, 4));
  return `${visibleStart}${masked}${visibleEnd}`;
};
