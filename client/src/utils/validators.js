export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email address is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Please enter a valid email address';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return 'Phone number is required';
  const cleaned = phone.trim().replace(/\D/g, '');
  if (cleaned.length !== 10) return 'Phone number must be exactly 10 digits';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

export const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (confirmPassword !== password) return 'Passwords do not match';
  return null;
};

export const validateName = (name) => {
  if (!name || !name.trim()) return 'Name is required';
  if (name.trim().length > 100) return 'Name cannot exceed 100 characters';
  return null;
};

export const validateCourse = (course) => {
  if (!course || !course.trim()) return 'Course selection is required';
  return null;
};

export const validateYear = (year) => {
  if (!year) return 'Academic year is required';
  const yr = Number(year);
  if (isNaN(yr) || yr < 1 || yr > 4) return 'Year must be between 1 and 4';
  return null;
};
