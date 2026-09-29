/**
 * Async wrapper to catch promises and forward to Express error middleware
 * Eliminates repetitive try-catch blocks in controllers
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
