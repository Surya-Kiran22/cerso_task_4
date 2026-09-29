/**
 * Formats a 10-digit phone number into (XXX) XXX-XXXX or XXX-XXX-XXXX format
 */
export const formatPhone = (phoneStr) => {
  if (!phoneStr) return '';
  const cleaned = ('' + phoneStr).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneStr;
};

/**
 * Formats ISO date string into readable format e.g. "Sep 29, 2026"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Returns ordinal string for Year (e.g. 1st, 2nd, 3rd, 4th)
 */
export const getYearOrdinal = (yearNum) => {
  switch (Number(yearNum)) {
    case 1:
      return '1st Year';
    case 2:
      return '2nd Year';
    case 3:
      return '3rd Year';
    case 4:
      return '4th Year';
    default:
      return `Year ${yearNum}`;
  }
};
