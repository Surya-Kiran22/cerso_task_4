/**
 * Standardized API response format helpers
 */

export const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
  const payload = {
    success: true,
    message,
  };
  if (data !== null && data !== undefined) {
    payload.data = data;
  }
  return res.status(statusCode).json(payload);
};

export const sendError = (res, statusCode = 500, message = 'An unexpected error occurred', errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors && Array.isArray(errors) && errors.length > 0) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
};
